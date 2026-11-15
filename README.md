# Betaflight presets

Small, focused presets for settings reused across a personal fleet. Each preset changes one part of the setup, so OSD preferences, rates, throttle response and switch assignments can be applied separately.

These are **experimental personal presets for Betaflight 4.5.5**. The app groups them under firmware 4.5; compatibility with other versions has not been established. Values were extracted from saved configurations. The packaged presets have passed offline validation; they have not been applied to hardware or flight-tested as presets.

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
| [Post-flight statistics](presets/4.5/osd/post-flight-statistics.txt) | Statistics selection and average cell voltage. Pavo20 option also shows minimum link quality. |
| [Actual fleet rates](presets/4.5/rates/actual-fleet-rates.txt) | Roll/pitch/yaw center sensitivity 190/190/200 degrees/second, maximum rates 720/720/630 degrees/second and expo 0.54/0.54/0.56. Existing rate caps still apply. |
| [Throttle curve](presets/4.5/other/throttle-mid-expo.txt) | Midpoint 0.50 and expo 0.35. |
| [Pavo switches](presets/4.5/modes/pavo-aux1-arm.txt) | AUX1 arm, AUX2 Angle, AUX3 prearm/turtle, AUX5 beeper. Optional GPS Rescue on AUX4 high. |
| [DJI switches](presets/4.5/modes/dji-aux4-arm.txt) | AUX4 arm, AUX1 Angle, AUX2 prearm/turtle, AUX5 beeper. Optional GPS Rescue on AUX3 high. |

Rates and throttle each offer destination profiles 1–4 and activate the selected profile. Profile 1 is the default. Select exactly one profile in each preset, using the same profile for both when they should work together.

The switch presets are alternatives. **Each replaces all 20 mode ranges**, removing existing custom modes and GPS Rescue switch assignments. GPS Rescue is off by default in their options. Enable it only after configuring and verifying GPS Rescue on that aircraft; these presets do not configure failsafe or rescue behavior. AUX1 is receiver channel 5, AUX2 is channel 6, and so on. Physical switch labels depend on the transmitter model.

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
