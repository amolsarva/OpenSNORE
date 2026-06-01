# OpenSnoRE Homepage: Start Here

This is the prioritized usability backlog for the homepage. Start with the
one-hour sprint before polishing individual experiments.

## Product Direction

OpenSnoRE should lead with one clear joke and two useful adjacent paths:

1. Press `SNORE` and hear a synthetic snore.
2. Open guided exercises for quieter nights.
3. Analyze a short sleep-audio clip locally.

Meeting automation, hold timers, wake detection, achievements, alibis, viral
missions, install prompts, and GitHub growth prompts are secondary. Keep them
available only when they do not delay the first snore.

## One-Hour Sprint

Goal: make the live homepage usable before attempting a broader redesign.

### 0-15 Minutes: Restore Basic Reachability

- [x] Allow the homepage to scroll vertically. The app shell previously clipped
  content below the viewport.
- [x] Register the service worker relative to the deployed app base path so a
  GitHub Pages deployment under `/OpenSNORE/` requests `/OpenSNORE/sw.js`.

### 15-45 Minutes: Put The Product First

- [x] Remove the growth checklist from the first screen.
- [x] Put the real `SNORE` button and sleeping character at the start of Snore
  Mode.
- [x] Add direct secondary actions for exercises and local audio analysis.
- [x] Move install prompts below the primary interaction.
- [x] Collapse joke extras and draft meeting tools behind an explicit
  experiments disclosure.
- [x] Rename GitHub links from `Star this page` to `Star on GitHub`.

### 45-60 Minutes: Verify

- [x] Run `npm run verify`.
- [x] Open the local preview in a browser and confirm desktop scrolling.
- [x] Check a narrow mobile viewport and confirm the main `SNORE` button is
  reachable without scrolling through promotional content.
- [x] Confirm service-worker registration targets `/OpenSNORE/sw.js` in a
  GitHub Pages build or deployed preview.
- [ ] Click `SNORE` in Chrome, Safari, and iPhone Safari before publishing.

## Two-Hour Sprint: Trust And Scope

- [x] Replace the homepage's broad AI-agent promise with copy that describes
  the working synthetic-snore interaction.
- [x] Keep Meeting Link Opener, Hold Timer Simulation, and Name Wake Experiment
  behind an explicit experiments disclosure until they have concrete outcomes.
- [x] Label canned demo sequences as simulations.
- [x] Separate browser-dependent experiments from features that work
  consistently.
- [x] Add a compact session-stats view below the primary interaction on mobile.
- [x] Review the Stop Snoring health copy. Avoid absolute claims such as
  `Muscle, not anatomy` and `Tongue posture matters most`.
- [x] Add a clear prompt to seek medical advice when snoring may indicate sleep
  apnea or another sleep disorder.

## Three-Hour Sprint: Install And Browser Confidence

- [x] Replace the homepage install banner with one quiet `Install options`
  link after the primary interaction.
- [x] Add a dedicated install page with separate Mac release, iPhone home
  screen, and website-sharing choices.
- [x] State clearly that installation is optional and that iPhone users do not
  need an App Store download.
- [x] Remove forceful training language such as `press hard`, `lungs fully
  empty`, and `fill your lungs to capacity`.
- [x] Add a rendered Chromium regression harness for desktop hierarchy,
  disclosures, install navigation, mobile stats, and SNORE start/stop state.
- [x] Run the rendered regression harness in the Pages workflow under `xvfb`.
- [ ] Test real speaker output in Chrome, Safari, and iPhone Safari before
  publishing.

## Later Cleanup

- [x] Reduce eight personality presets to three visible presets plus `More`.
- [x] Redesign achievements that unlock for opening a tab rather than
  completing a meaningful action.
- [x] Keep GitHub and sharing prompts out of the first-run path until the user
  has heard a snore.
- [x] Decide whether the Mac download and PWA install instructions deserve a
  dedicated install page.
- [x] Add source-level regression checks for vertical scrolling, mobile
  first-action hierarchy, and service-worker scope.
- [x] Add a fake Web Audio smoke test for synthetic-snore startup and shutdown.
- [x] Add a browser regression test for Web Audio startup.
- [ ] Verify the production deployment with the checklist in
  `docs/DEPLOYMENT.md`.
