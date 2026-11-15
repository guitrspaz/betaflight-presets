import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { join, relative } from 'node:path';

// Use the actual upstream option parser so tests check what the app will emit.
const parserSource = stripTypeScriptTypes(readFileSync('vendor/betaflight-app/PresetParser.ts', 'utf8'));
const { default: PresetParser } = await import(`data:text/javascript;base64,${Buffer.from(parserSource).toString('base64')}`);
const indexText = readFileSync('index.json', 'utf8');
const index = JSON.parse(indexText);
const reference = JSON.parse(readFileSync('validation/reference-values.json', 'utf8'));
const hash = (data) => createHash('sha256').update(data).digest('hex');
assert.equal(readFileSync('index_hash.txt', 'utf8').trim(), hash(indexText), 'Index hash is stale');
const parser = new PresetParser(index.settings);
function files(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(folder, entry.name)) : [join(folder, entry.name)]);
}
assert.deepEqual(index.presets.map((p) => p.fullPath).sort(), files('presets').sort(), 'Rebuild the index after adding or removing files');

function commands(lines, checked) {
  return parser.removeUncheckedOptions(lines, checked).map((line) => line.trim()).filter((line) => line && !line.startsWith('#'));
}
function simulate(cli) {
  const result = { settings: {}, profiles: Array.from({ length: 4 }, () => ({})), modes: new Map(), selected: null };
  for (const line of cli) {
    const profile = /^rateprofile ([0-3])$/.exec(line);
    const setting = /^set ([a-z0-9_]+) = (.+)$/.exec(line);
    const mode = /^aux (\d+) (\d+) (\d+) (\d+) (\d+) 0 0$/.exec(line);
    if (profile) result.selected = Number(profile[1]);
    else if (setting) {
      const [, key, value] = setting;
      if (key in reference.rates || key in reference.throttle) {
        assert.notEqual(result.selected, null, 'Select a rate profile before writing its settings');
        result.profiles[result.selected][key] = value;
      } else result.settings[key] = value;
    } else if (mode) {
      assert(Number(mode[1]) < 20, 'Mode slot exceeds the 4.5 table');
      result.modes.set(Number(mode[1]), line);
    } else assert.fail(`Unexpected CLI command: ${line}`);
  }
  return result;
}

let scenarios = 0;
for (const entry of index.presets) {
  const text = readFileSync(entry.fullPath, 'utf8');
  assert.equal(entry.hash, hash(text), `Stale index entry: ${entry.fullPath}`);
  assert.deepEqual(entry.firmware_version, ['4.5']);
  assert.equal(entry.status, 'EXPERIMENTAL');
  const lines = text.split('\n').map((line) => line.trim());
  const preset = { ...entry };
  parser.readPresetProperties(preset, lines);
  const group = preset.options.find((option) => option.isExclusive);
  const choices = group ? [[], ...group.childs.map((option) => [option.name])] : preset.options.reduce(
    (combinations, option) => [...combinations, ...combinations.map((checked) => [...checked, option.name])], [[]]);
  if (group) assert.equal(group.childs.filter((option) => option.checked).length, 1);
  for (const checked of choices) {
    const cli = commands(lines, checked);
    const result = simulate(cli);
    const name = relative('presets/4.5', entry.fullPath);
    if (name.startsWith('rates/') || name.startsWith('other/')) {
      assert.deepEqual(result.settings, {});
      assert.equal(result.modes.size, 0);
      if (!checked.length) assert.equal(cli.length, 0, 'No profile choice must be a no-op');
      else {
        const selected = group.childs.findIndex((option) => option.name === checked[0]);
        assert.equal(result.selected, selected);
        assert.deepEqual(result.profiles[selected], name.startsWith('rates/') ? reference.rates : reference.throttle);
        result.profiles.forEach((profile, i) => { if (i !== selected) assert.deepEqual(profile, {}); });
      }
    } else if (name.startsWith('modes/')) {
      assert.deepEqual(result.settings, {});
      assert.equal(result.selected, null);
      result.profiles.forEach((profile) => assert.deepEqual(profile, {}));
      const variant = name.slice('modes/'.length, -4);
      assert(group, 'Aircraft choices must be exclusive');
      assert.deepEqual(group.childs.map((option) => option.name), ['Leave modes unchanged', ...Object.keys(reference.modes[variant])]);
      assert.equal(group.childs.find((option) => option.checked).name, 'Leave modes unchanged', 'Default must not select an aircraft');
      if (!checked.length || checked[0] === 'Leave modes unchanged') {
        assert.equal(cli.length, 0, 'No aircraft choice must leave all modes unchanged');
      } else {
        const expected = reference.modes[variant][checked[0]];
        assert.equal(cli.length, 20, 'Emit exactly one command for each mode slot');
        assert.equal(result.modes.size, 20, 'Replace the complete saved mode table');
        assert.deepEqual([...result.modes.keys()], Array.from({ length: 20 }, (_, i) => i));
        assert.deepEqual([...result.modes.values()], expected, `Saved assignments differ for ${checked[0]}`);
        assert.equal(cli.filter((line) => /^aux \d+ 0 \d+ 1700 2100/.test(line)).length, 1, 'Exactly one arm range');
      }
    } else if (name === 'gps/enable-galileo.txt') {
      assert.equal(cli.length, 1, 'Galileo preset must emit only its one setting');
      assert.equal(preset.options.length, 0);
      assert.deepEqual(result.settings, { gps_ublox_use_galileo: 'ON' });
      assert.equal(result.selected, null);
      assert.equal(result.modes.size, 0);
      result.profiles.forEach((profile) => assert.deepEqual(profile, {}));
    } else {
      assert.equal(result.selected, null);
      assert.equal(result.modes.size, 0);
      if (name === 'osd/hd-fleet-layout.txt') {
        assert.deepEqual(preset.options.map((option) => option.name), ['F6 display variant', 'DJI control - hide transmitter power']);
        assert(preset.options.every((option) => !option.checked), 'Layout variants must remain opt-in');
        const layout = checked.includes('F6 display variant') ? reference.f6Layout : reference.baseLayout;
        const hideTxPower = checked.includes('DJI control - hide transmitter power');
        assert.deepEqual(result.settings, {
          osd_units: 'IMPERIAL', osd_profile: '1', osd_stick_overlay_radio_mode: '2', osd_gps_sats_show_pdop: 'ON',
          ...layout,
          ...(hideTxPower ? { osd_link_tx_power_pos: String(Number(layout.osd_link_tx_power_pos) & ~2048) } : {}),
          osd_camera_frame_width: '30', osd_camera_frame_height: '16',
        });
        if (hideTxPower) {
          const actualPosition = Number(result.settings.osd_link_tx_power_pos);
          const savedPosition = Number(layout.osd_link_tx_power_pos);
          assert.equal(actualPosition & (7 << 11), 0, 'Control-transmitter power must be hidden');
          assert.equal(actualPosition & ~(7 << 11), savedPosition & ~(7 << 11), 'Preserve transmitter-power coordinates and display type');
          assert.equal(result.settings.osd_sys_lq_pos, layout.osd_sys_lq_pos, 'Preserve the DJI video-link indicator');
        }
        for (const [key, value] of Object.entries(result.settings)) {
          if (!key.endsWith('_pos')) continue;
          const bits = Number(value);
          const x = (bits & 31) | ((bits & 1024) >> 5);
          const y = (bits >> 5) & 31;
          assert(x < 53 && y < 20, `OSD element outside 53 x 20 canvas: ${key}`);
        }
        const left = Number(result.settings.osd_stick_overlay_left_pos);
        const right = Number(result.settings.osd_stick_overlay_right_pos);
        const column = (bits) => (bits & 31) | ((bits & 1024) >> 5);
        assert(column(left) < column(right), 'Left stick overlay must be left of the right stick overlay');
        assert.equal((left >> 5) & 31, (right >> 5) & 31, 'Stick overlays must share a row');
      } else if (name === 'osd/common-osd-timers.txt') {
        assert.equal(cli.length, 2, 'Timer preset must emit only the two timer definitions');
        assert.equal(preset.options.length, 0, 'Common timers have no aircraft-specific options');
        result.profiles.forEach((profile) => assert.deepEqual(profile, {}));
        assert.deepEqual(result.settings, reference.timers);
        const decodeTimer = (value) => ({ source: Number(value) & 15, precision: (Number(value) >> 4) & 15, alarmMinutes: (Number(value) >> 8) & 255 });
        assert.deepEqual(decodeTimer(result.settings.osd_tim1), { source: 0, precision: 0, alarmMinutes: 10 }, 'Timer 1: power-on time, whole seconds, 10-minute alarm');
        assert.deepEqual(decodeTimer(result.settings.osd_tim2), { source: 1, precision: 0, alarmMinutes: 0 }, 'Timer 2: total armed time, whole seconds, no alarm');
      } else {
        assert.equal(name, 'osd/post-flight-statistics.txt', 'Unrecognized preset scope');
        const variants = {
          'Base statistics (F5, F6, FlyLens85)': reference.statistics.base,
          'Pavo20 post-flight statistics variant': reference.statistics.pavo,
          'Pavo - add minimum RSSI dBm': reference.statistics.pavoRssiDbm,
          'Helion - current statistics': reference.statistics.helion,
        };
        assert(group, 'Statistics choices must be exclusive');
        assert.deepEqual(group.childs.map((option) => option.name), Object.keys(variants));
        assert.equal(group.childs.find((option) => option.checked).name, 'Base statistics (F5, F6, FlyLens85)', 'Keep the existing base statistics as the default');
        result.profiles.forEach((profile) => assert.deepEqual(profile, {}));
        if (!checked.length) {
          assert.equal(cli.length, 0, 'No statistics choice must leave settings unchanged');
          assert.deepEqual(result.settings, {});
        } else {
          assert.equal(cli.length, 2, 'Change only the statistics mask and average cell voltage');
          assert.deepEqual(result.settings, { osd_stat_bitmask: variants[checked[0]], osd_stat_avg_cell_value: 'ON' });
          if (checked[0] === 'Pavo - add minimum RSSI dBm') {
            const mask = Number(result.settings.osd_stat_bitmask);
            const savedPavo = Number(reference.statistics.pavo);
            assert.equal(mask ^ savedPavo, 1 << 23, 'Optional Pavo choice must change only the minimum RSSI dBm bit');
            assert(mask & (1 << 23), 'Minimum RSSI dBm must be enabled');
            assert.equal(mask & savedPavo, savedPavo, 'Preserve every saved Pavo statistic');
          }
          if (checked[0] === 'Helion - current statistics') {
            const mask = Number(result.settings.osd_stat_bitmask);
            for (const bit of [12, 13, 17, 23, 25]) assert(mask & (1 << bit), 'Preserve Helion Blackbox and minimum link statistics');
            assert.equal(mask & (1 << 21), 0, 'Preserve Helion omission of lifetime Total Flight Time');
          }
        }
      }
    }
    scenarios++;
  }
}
console.log(`OK: ${index.presets.length} presets, ${scenarios} app-parser scenarios; index hashes and command scopes verified`);
