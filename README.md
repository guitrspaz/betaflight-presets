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
| [HD fleet OSD layout](presets/4.5/osd/hd-fleet-layout.txt) | Imperial units and the saved HD layout, including the GPS PDOP estimate beside satellite count. Selects OSD profile 1 and replaces element positions and visibility across all three OSD profiles. Optional F6 layout and exclusive control-link display choices: keep layout, hide DJI transmitter power, or replace ELRS transmitter power with live RSSI dBm. Requires an already working 53 × 20 HD MSP DisplayPort setup. |
| [Common OSD timers](presets/4.5/osd/common-osd-timers.txt) | Timer 1: power-on time with a 10-minute visual alarm. Timer 2: total armed time since power-on, accumulating across rearming, with no timer alarm. Both use minutes:seconds. Positions and visibility remain unchanged. |
| [Post-flight statistics](presets/4.5/osd/post-flight-statistics.txt) | Mutually exclusive choices: saved base (F5/F6/FlyLens85, default), saved Pavo20 (also matches Pavo20-Pro), Pavo with added minimum RSSI dBm, or saved Helion. Each enables average cell voltage. Helion preserves its minimum link quality, RSSI dBm, signal-to-noise and Blackbox fields. |
| [GPS — enable Galileo](presets/4.5/gps/enable-galileo.txt) | Enables only the Galileo setting. Requires an already working, Galileo-capable UBLOX GPS with Auto Config enabled. |
| [Actual fleet rates](presets/4.5/rates/actual-fleet-rates.txt) | Roll/pitch/yaw center sensitivity 190/190/200 degrees/second, maximum rates 720/720/630 degrees/second and expo 0.54/0.54/0.56. Existing rate caps still apply. |
| [Throttle curve](presets/4.5/other/throttle-mid-expo.txt) | Midpoint 0.50 and expo 0.35. |
| [Pavo / Helion switches](presets/4.5/modes/pavo-aux1-arm.txt) | Choose Helion-10, Pavo20 or Pavo20-Pro to restore its saved mode table. AUX1 arm, AUX2 Angle, AUX3 prearm/turtle, AUX5 beeper; includes existing Rescue and USER1 assignments where present. Default leaves modes unchanged. |
| [DJI switches](presets/4.5/modes/dji-aux4-arm.txt) | Choose Evoque F5, Evoque F6 or FlyLens85 to restore its saved mode table. AUX4 arm, AUX1 Angle, AUX2 prearm/turtle, AUX5 beeper; includes existing Rescue and USER1 assignments where present. Default leaves modes unchanged. |

The HD layout preset offers an exclusive Control-link display group. Keep layout control-link display is selected by default and adds no overrides. DJI control - hide transmitter power is intended for F5, F6 and FlyLens85 using DJI/SBUS control; it hides only the control-transmitter power field relative to the chosen layout. ELRS - RSSI dBm instead of transmitter power is intended for Helion-10, Pavo20 and Pavo20-Pro; it hides transmitter power and displays received control-signal strength in the same slot. The ELRS and DJI overrides cannot be selected together in the app. Each preserves link quality, the separate DJI video-link indicator, warning thresholds and all other fields in the chosen base or F6 layout. The seven-cell RSSI dBm readout, including a diversity suffix, fits before the unchanged link-quality field. Applying the preset still applies its full layout scope; these choices are not standalone patches. Aircraft application and goggles verification remain pending.

The Galileo preset changes only `gps_ublox_use_galileo = ON`. It does not set up GPS wiring, ports, baud rate, feature enablement or Rescue. After saving and restarting both the flight controller and GPS module, verify communication and an outdoor fix. Module acceptance, satellite count, acquisition time and fix quality need checking before claiming a benefit. Configuration guidance: [Betaflight GPS tab](https://betaflight.com/docs/wiki/app/gps-tab).

The base, original Pavo20 and Helion statistics choices reproduce the saved selections from 2026-11-13. The optional Pavo - add minimum RSSI dBm choice retains every saved Pavo20/Pavo20-Pro statistic and adds only the weakest received control-signal strength to the post-flight summary. It has not been applied to aircraft. Base is selected by default, and clearing all choices emits no commands. The Helion choice also preserves its existing omission of the lifetime Total Flight Time field. Available fields depend on firmware features and working telemetry or logging. This preset changes the summary after disarming; in-flight OSD positions, visibility, warnings and timers remain unchanged.

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
| 2026-11-15 | All eight current presets | All 35 app-parser scenarios passed, including index hashes, command scope, option combinations, exclusive choices and rate-profile isolation. | Offline checks do not simulate firmware or establish hardware behavior. |
| 2026-11-15 | Optional ELRS live RSSI dBm substitution | Eight layout-option scenarios passed, covering base/F6 with each exclusive control-link choice and no choice. The ELRS override changes only transmitter-power and RSSI dBm settings, retains link quality, and fits a seven-cell RSSI readout in the original power slot. | Offline validation only; aircraft application and goggles rendering remain pending. |
| 2026-11-15 | Explicit show-PDOP layout preference | ON matches all six saved aircraft. At introduction, all four then-available layout-option combinations retained every prior setting and position, adding only the explicit PDOP preference. | Configuration and parser comparison only; no new aircraft application or goggles verification. |
| 2026-11-15 | Optional DJI control-transmitter power cleanup | Base and F6 layouts were tested with and without cleanup. Relative to base, cleanup changes only transmitter-power visibility; with F6 it is a no-op because the field is already hidden. | Offline validation only; aircraft application and goggles rendering remain pending. |
| 2026-11-15 | Common timers, aircraft switch choices and original post-flight statistics choices | Generated commands matched the corresponding settings in all six saved aircraft configurations from 2026-11-13, including the Helion statistics selection. | These newly packaged choices were not reapplied to aircraft during this comparison. |
| 2026-11-15 | Optional Pavo minimum RSSI dBm statistics choice | Parsed output preserves every saved Pavo statistic and enables only the additional minimum RSSI dBm bit. | Offline validation only; aircraft application and goggles rendering remain pending. |
| 2026-11-15 | Galileo preset CLI payload on FlyLens85 | The command was accepted, saved and rebooted. Unsaved and saved full-configuration comparisons showed exactly one changed setting: Galileo OFF to ON, with zero unexpected differences. | Full flight-controller/GPS power-cycle, module acceptance, outdoor fix and performance comparison remain unverified. |

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
