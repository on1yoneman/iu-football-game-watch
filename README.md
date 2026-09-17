# IU Football Game Watch

Source snapshot of the IU Football Game Watch project hosted on Hatchable at
https://iu-football-game.hatchable.site. The initial files match Hatchable
deployment version 9 (September 15, 2026).

## Files

- `public/index.html` — mobile roster, depth charts, injuries, stats, and schedule
- `public/player-bios.js` — adds player bio links to the roster
- `api/player-bios.js` — Hatchable server function that finds player bios on the IU roster

Hatchable remains the live host. Changes pushed to this repository alone do not
update the website. To publish a change, update the Hatchable project and deploy
it there, then save the same files here. The `api/` file uses Hatchable's runtime;
GitHub Pages cannot run it as-is.

The `AGENTS.md` returned by Hatchable is a generated platform guide, not a
project source file, so it is not included here.
