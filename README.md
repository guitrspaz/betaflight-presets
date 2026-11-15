# Betaflight presets

Small, focused presets for settings reused across a personal fleet. Each preset changes one part of the setup, so OSD preferences, rates, throttle response and switch assignments can be applied separately.

These are **experimental personal presets for Betaflight 4.5.5**. The app groups them under firmware 4.5; compatibility with other versions has not been established. Values were extracted from saved configurations. Offline validation and the completed aircraft configuration checks are recorded below; goggles rendering, flight behavior and the complete Presets-tab workflow remain unverified by these checks.

## Add the source

In Betaflight, open **Presets → Preset Sources** and add:

| Field | Value |
| --- | --- |
| Name | guitrspaz presets |
| URL | `https://github.com/guitrspaz/betaflight-presets` |
| Branch | `main` |

Enable the source and search for `guitrspaz`. Include **EXPERIMENTAL** in the status filter if needed. Keep the official source enabled for other presets.

## Presets

| Preset | Changes and options |
| --- | --- |
| [HD fleet OSD layout](presets/4.5/osd/hd-fleet-layout.txt) | Imperial units and the saved HD layout. Selects OSD profile 1 and replaces element positions and visibility across all three OSD profiles. Optional F6 display variant. Requires an already working 53 × 20 HD MSP DisplayPort setup. |
| [Common OSD timers](presets/4.5/osd/common-osd-timers.txt) | Timer 1: power-on time with a 10-minute visual alarm. Timer 2: total armed time since power-on, accumulating across rearming, with no timer alarm. Both use minutes:seconds. Positions and visibility remain unchanged. |
| [Post-flight statistics](presets/4.5/osd/post-flight-statistics.txt) | Mutually exclusive saved selections: base (F5/F6/FlyLens85, default), Pavo20 (also matches Pavo20-Pro), or Helion. Each enables average cell voltage. Helion preserves its minimum link quality, RSSI dBm, signal-to-noise and Blackbox fields. |
| [Actual fleet rates](presets/4.5/rates/actual-fleet-rates.txt) | Roll/pitch/yaw center sensitivity 190/190/200 degrees/second, maximum rates 720/720/630 degrees/second and expo 0.54/0.54/0.56. Existing rate caps still apply. |
| [Throttle curve](presets/4.5/other/throttle-mid-expo.txt) | Midpoint 0.50 and expo 0.35. |
| [Pavo / Helion switches](presets/4.5/modes/pavo-aux1-arm.txt) | Choose Helion-10, Pavo20 or Pavo20-Pro to restore its saved mode table. AUX1 arm, AUX2 Angle, AUX3 prearm/turtle, AUX5 beeper; includes existing Rescue and USER1 assignments where present. Default leaves modes unchanged. |
| [DJI switches](presets/4.5/modes/dji-aux4-arm.txt) | Choose Evoque F5, Evoque F6 or FlyLens85 to restore its saved mode table. AUX4 arm, AUX1 Angle, AUX2 prearm/turtle, AUX5 beeper; includes existing Rescue and USER1 assignments where present. Default leaves modes unchanged. |

The statistics choices reproduce the saved selections from 2026-11-13. Select the matching choice; base is selected by default, and clearing all choices emits no commands. The Helion choice also preserves its existing omission of the lifetime Total Flight Time field. Available fields depend on firmware features and working telemetry or logging. This preset changes the summary after disarming; in-flight OSD positions, visibility, warnings and timers remain unchanged.

The timer preset reproduces the definitions shared by all six saved aircraft configurations from 2026-11-13. Apply it separately from the layout when those timer meanings are desired. Timer 1 includes ground time; its alarm is based on power-on time. Timer 2 pauses while disarmed and resumes when rearmed. Both timers reset when the flight controller restarts.

Rates and throttle each offer destination profiles 1–4 and activate the selected profile. Profile 1 is the default. Select exactly one profile in each preset, using the same profile for both when they should work together.

The switch presets are alternatives. **Leave modes unchanged is the default and emits no commands.** Select exactly one matching aircraft to replace all 20 mode ranges with its saved table from 2026-11-13, including empty slots. These choices restore a snapshot; they do not merge with newer assignments. Reconcile later mode changes with a fresh backup before applying.

| Aircraft choice | Saved GPS Rescue switch | Saved USER1 assignment |
| --- | --- | --- |
| Helion-10 | AUX4 high | AUX9, 900–2100 |
| Pavo20 | AUX4 high | None |
| Pavo20-Pro | None | None |
| Evoque F5 | AUX3 high | AUX9, 900–2100 |
| Evoque F6 | AUX3 high | AUX9, 900–2100 |
| FlyLens85 | None | None |

USER1 assignments are preserved without changing their names, PINIO settings or resources. Their hardware purpose must be verified separately. GPS Rescue assignments reproduce the saved switch mapping; they do not establish that Rescue is configured or flight-tested. These presets do not configure GPS, failsafe or Rescue parameters. The Pavo20-Pro snapshot predates its planned GPS installation. AUX1 is receiver channel 5, AUX2 is channel 6, and so on. Physical switch labels depend on the transmitter model.

## Validation record

Status as of **2026-11-15**. Results apply to the revisions and settings described, rather than every later version of a preset.

| Date | Scope | Verified result | Limits |
| --- | --- | --- | --- |
| 2026-11-12 | Earlier HD fleet OSD base-layout payload on Helion 10 | All 81 commands accepted; 45 OSD fields changed. Unsaved comparison and saved/rebooted full readback matched expectations with zero unexpected differences. | CLI payload applied directly after processing with the pinned app parser. F6 option and later preset revisions were not covered by this full-payload check. |
| 2026-11-13 | Corrected stick-overlay positions on Helion 10, F5, F6, Pavo20, Pavo20-Pro and FlyLens85 | Every saved/rebooted full aircraft readback showed exactly the two intended position changes and zero unexpected differences. | Only the two position commands were applied; this was not a full layout-preset application on all six aircraft. |
| 2026-11-15 | All seven current presets | All 27 app-parser scenarios passed, including index hashes, command scope, exclusive choices and rate-profile isolation. GitHub validation passed. | Offline checks do not simulate firmware or establish hardware behavior. |
| 2026-11-15 | Common timers, aircraft switch choices and post-flight statistics choices | Generated commands matched the corresponding settings in all six saved aircraft configurations from 2026-11-13, including the Helion statistics selection. | These newly packaged choices were not reapplied to aircraft during this comparison. |

The complete Presets-tab application workflow, actual goggles appearance and flight behavior remain unverified by this record. Configuration readback establishes the saved settings, not their visual appearance or flight performance. Aircraft backups, identities and detailed bench evidence remain private outside this repository.

## Apply and verify

1. Save an aircraft-specific backup before applying anything. Store `dump all`, `diff all` and the firmware version outside this repository, and keep the matching firmware available for recovery.
2. Apply only the pieces needed. Read their descriptions and options, and inspect **View CLI** before saving. Later presets overwrite overlapping values.
3. Save, reconnect, check for CLI errors and compare a fresh configuration readback with the intended changes. If there are errors or unexpected changes, restore the backup using the matching firmware before continuing.
4. Check the OSD in the goggles. With propellers removed, verify receiver channels, arm/prearm, modes, beeper and the selected rate profile before flying.

The shared presets leave battery alarm thresholds, warning masks, receiver protocol, UARTs, resource mappings, motor configuration, sensor calibration and PID/filter tuning unchanged. OSD sensor elements still require working sensors. Switch presets change mode ranges only.

## Maintain the collection

Use Node.js 22.18 or newer. No package installation is needed.

```sh
npm run build
npm test
```

Commit `index.json` and `index_hash.txt` with each preset change. The checks validate metadata and hashes, process every option through the pinned Betaflight app parser, compare the resulting settings with curated reference values, and check mode-table replacement and rate-profile isolation. They do not simulate firmware or certify flight behavior.

Add only settings intended for reuse. Keep complete aircraft dumps, binding data, serial numbers and calibration records outside the repository. When firmware changes, validate the commands and behavior before declaring support. The indexer and validation parser are pinned upstream copies; their revisions and license details are in [NOTICE](NOTICE).

Format and application behavior follow the [official firmware-presets documentation](https://github.com/betaflight/firmware-presets) and [Presets tab guide](https://betaflight.com/docs/wiki/app/presets-tab).
