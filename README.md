# OpenSnoRE

**The AI Agent for Boring Situations. Also, somehow, a pocket-sized snoring coach.**

[![Deploy to GitHub Pages](https://github.com/amolsarva/OpenSNORE/actions/workflows/deploy.yml/badge.svg)](https://github.com/amolsarva/OpenSNORE/actions/workflows/deploy.yml)
[![Build Mac App](https://github.com/amolsarva/OpenSNORE/actions/workflows/build-mac.yml/badge.svg)](https://github.com/amolsarva/OpenSNORE/actions/workflows/build-mac.yml)

OpenSnoRE is a small, weird, useful React app that does two things:

1. It generates theatrical synthetic snoring for moments of maximum boredom.
2. It gives you guided, evidence-inspired myofunctional exercises that may help reduce real snoring over time.

It is part toy, part wellness experiment, part audio sandbox, and part invitation to build the world's friendliest open-source snoring lab.

If that sentence made you smile, please star the repo. If it made you think "I can make this better," please fork it.

## Try It
⭐️ 2-second demo: click https://opensnore.newaiyork.com and press the big button. If it makes you grin, star this repo.



- Web app: https://opensnore.newaiyork.com
- Latest Mac build: https://github.com/amolsarva/OpenSNORE/releases/latest
- iPhone/PWA install: open the web app in Safari, tap Share, then Add to Home Screen.

## What It Does Today

### Snore Mode

Press the big button and OpenSnoRE becomes your personal anti-productivity assistant.

Current snore personalities:

- **The Gentleman**: subtle, dignified, almost apologetic.
- **The Chainsaw**: industrial, relentless, emotionally unavailable.
- **The Harmonist**: musical enough to be suspicious.
- **The Freight Train**: deep, low, tectonic.

Under the hood, these are generated live with the Web Audio API. No snore files are shipped. The app synthesizes pink noise, shapes it through filters, adds envelopes, sweeps resonances, applies optional distortion, and occasionally gets a little too proud of itself.

### Bored-O-Meter

Choose what you are suffering through:

- team standup
- quarterly review
- mandatory HR training
- terms and conditions
- NFT pitch meeting
- synergy discussion
- and other tragic modern experiences

The app tracks your endured time, snore count, and boredom level. This is not science. This is office anthropology.

### Stop Snoring

OpenSnoRE also includes guided exercises for the throat, tongue, jaw, soft palate, and breathing patterns.

Current exercise categories:

- **Tongue**: tongue slides, tongue presses, posture training.
- **Throat & Jaw**: vowel articulation, singing scales, jaw release.
- **Breathing**: 4-7-8 breathing, belly breathing, humming breath.

Current guided programs:

- **The First Timer**
- **Morning Protocol**
- **Pre-Sleep Wind-Down**
- **The Full Treatment**
- **The Choir Method**

Each exercise has timed steps, reps, progress UI, completion state, and short science notes so the app feels less like a checklist and more like a coach with a timer.

## Important Health Note

OpenSnoRE is not a medical device, diagnostic tool, or replacement for clinical care.

Snoring can be harmless, annoying, relationship-damaging, or a symptom of obstructive sleep apnea. If snoring is loud, chronic, associated with choking/gasping, daytime sleepiness, morning headaches, high blood pressure, or witnessed breathing pauses, please talk to a qualified clinician or sleep specialist.

The exercises here are inspired by myofunctional therapy research, but the app does not diagnose conditions or guarantee outcomes.

## Tech Stack

- **React 18**
- **Vite 5**
- **Web Audio API**
- **Progressive Web App manifest + service worker**
- **Electron 32** for the desktop build
- **GitHub Actions** for Pages deploys and Mac release builds

There is intentionally no backend today. Everything runs locally in the browser or Electron shell.

## Project Structure

```text
opensnore/
  electron/
    main.js                  # Electron window wrapper
  public/
    manifest.json            # PWA metadata
    sw.js                    # tiny service worker
    icon-192.png
    icon-512.png
    apple-touch-icon.png
    CNAME                    # custom GitHub Pages domain
  src/
    App.jsx                  # main app shell, tabs, snore mode
    main.jsx                 # React entrypoint
    index.css                # app styling
    audio/
      snoreEngine.js         # procedural snore synthesis engine
    components/
      ExercisePlayer.jsx     # guided timed exercise modal
      SituationPicker.jsx    # boredom scenario picker
      SleepingCharacter.jsx  # sleepy character UI
      StopSnoringPage.jsx    # exercise library and programs
    data/
      exercises.js           # exercise and program content
  .github/workflows/
    deploy.yml               # GitHub Pages deployment
    build-mac.yml            # tagged Mac DMG release build
```

## Local Development

Requirements:

- Node.js 20 or newer is recommended.
- npm

Install dependencies:

```bash
npm ci
```

Start the web app:

```bash
npm run dev
```

Vite will print a local URL, usually:

```text
http://localhost:5173
```

Build the web app:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run the Electron app in development:

```bash
npm run electron:dev
```

Build the Mac desktop app:

```bash
npm run electron:build
```

The Electron output is written to:

```text
dist-electron/
```

## How the Snore Engine Works

The snore engine lives in `src/audio/snoreEngine.js`.

At a high level:

1. Create a pink-noise buffer.
2. Route it through one or more bandpass filters.
3. Add a low shelf for body and rumble.
4. Shape the amplitude with a breathing-like envelope.
5. Sweep filter frequencies during the snore.
6. Optionally add distortion.
7. Optionally layer a pitched oscillator for musical snores.
8. Loop the result according to the selected personality.

This gives contributors a fun place to experiment. You can add a new snore personality by extending the `PERSONALITIES` object with different frequency ranges, gain, duration, pause, Q value, distortion, and tone settings.

Example shape:

```js
{
  id: 'new-personality',
  name: 'The Dramatic Example',
  emoji: '🎭',
  description: 'A description with personality.',
  color: '#14b8a6',
  filterFreq: [120, 420],
  gain: 0.7,
  q: 2.4,
  duration: 2.5,
  pause: 500,
  distortion: 15,
  addTone: false,
}
```

## Adding Exercises

Exercises live in `src/data/exercises.js`.

An exercise has:

- an `id`
- a display `name`
- an `emoji`
- a `category`
- a `difficulty`
- a user-facing `benefit`
- a short `science` note
- timed `steps`
- a `reps` count

Programs are just curated lists of exercise IDs.

If you add exercises, keep them:

- clear enough to do without a coach standing nearby
- timed in practical chunks
- honest about evidence
- gentle about discomfort
- careful not to imply medical diagnosis

## Deployment

The web app deploys to GitHub Pages from the `website` branch using `.github/workflows/deploy.yml`.

Tagged releases matching `v*` can trigger the Mac app workflow in `.github/workflows/build-mac.yml`, which builds a DMG and uploads it to the GitHub release.

## Wishlist

This is where forks can get interesting.

### Audio Recording Upload + Snore Analysis

Let users upload a sleep audio recording and get a useful, privacy-respecting analysis of what is happening.

Possible first version:

- upload an audio file locally
- decode it in the browser
- detect likely snore events
- show a timeline of snoring intensity
- estimate snore frequency bands
- cluster snores into types, such as nasal, palatal, tongue-base, or irregular patterns
- flag moments that may deserve medical attention, without pretending to diagnose
- generate a "what to try next" exercise plan

Technical ingredients we may need:

- Web Audio decoding
- spectral analysis / FFT
- onset detection
- amplitude envelope tracking
- band energy ratios
- optional ML model for snore classification
- careful privacy design so recordings can stay local by default
- clear disclaimers around sleep apnea and medical risk

Stretch version:

- compare recordings before and after exercise programs
- nightly snore score trends
- exportable sleep report
- anonymized open dataset tooling for people who opt in
- model cards and evaluation notes for any classifier

### More Snore Personalities

Add new procedural snore characters:

- The Espresso Machine
- The Harbor Fog Horn
- The Haunted Accordion
- The Startup Founder Breathing Through A Pitch Deck
- The Tiny Polite Nap
- The Subwoofer Under A Mattress

Bonus points for personalities that are funny in the UI and meaningfully different in the audio graph.

### Better Exercise Coaching

Ideas:

- daily streaks
- reminders
- adaptive programs
- form tips
- voice-guided exercise mode
- "quiet mode" for doing exercises near sleeping people
- progress journal
- before/after self-ratings
- partner feedback mode

### Evidence Library

Make the science more transparent:

- cite the studies behind myofunctional therapy
- separate strong evidence from promising evidence
- add plain-English summaries
- link each exercise to the mechanism it targets
- include "what this does not prove" notes

### Accessibility

OpenSnoRE should be easy to use when tired, in bed, on a phone, or half-awake.

Wishlist:

- reduced-motion mode
- stronger keyboard navigation
- screen-reader review
- high-contrast theme
- larger timer mode
- captions for voice-guided exercises
- haptic cues on mobile where supported

### PWA + Offline Upgrades

The current service worker is tiny. It can become much better.

Ideas:

- richer offline caching
- install prompts
- update notifications
- offline exercise history
- local-only settings persistence

### Desktop App Polish

Electron wishlist:

- menu items
- app icon build resources
- signed and notarized Mac builds
- Windows and Linux builds
- auto-update flow
- local recording analysis with desktop file handling

### Developer Experience

Make the repo friendlier for new contributors:

- tests for the snore engine helpers
- component tests for exercise flows
- linting and formatting scripts
- issue templates
- PR template
- contributor guide
- architecture notes
- visual regression snapshots

### Wild Collaborative Stuff

Things that would be delightful:

- community-submitted snore personalities
- "snore jam" audio presets
- leaderboard for most ridiculous synthetic snore
- open exercise packs for singers, wind-instrument players, mouth breathers, and CPAP users
- local-first sleep diary
- generated bedtime soundscapes that respond to snore patterns
- a "make my meeting survivable" mode that keeps the joke but lowers the chaos

## Good First Issues

Looking for a manageable first fork? Try one of these:

- Add a new snore personality in `src/audio/snoreEngine.js`.
- Add one new boring situation in `src/components/SituationPicker.jsx`.
- Add a new guided exercise in `src/data/exercises.js`.
- Improve mobile spacing in `src/index.css`.
- Add persistent settings for the selected snore personality.
- Add a reduced-motion preference.
- Add a simple test setup.
- Improve the service worker cache list.

## Contribution Style

OpenSnoRE is playful, but good contributions should still be careful.

Please aim for:

- small, focused pull requests
- clear descriptions of what changed
- screenshots or screen recordings for UI changes
- honest wording around health claims
- local-first privacy for audio features
- no surprise backend requirements
- no dark patterns

If you are changing audio behavior, describe what changed and why. A snore can be funny and still have an implementation rationale.

## Design Principles

- **Funny first, useful second, misleading never.**
- **Local by default.** Especially for future audio recording analysis.
- **Tiny surface area.** The app should stay easy to run and fork.
- **No fake diagnosis.** Helpful signals are welcome; medical claims need evidence.
- **Make it inviting.** A contributor should be able to add a personality, exercise, or UI polish without needing a week-long onboarding.

## Scripts

```bash
npm run dev             # start Vite
npm run build           # build web app
npm run preview         # preview production build
npm run electron:dev    # run Electron + Vite together
npm run electron:build  # build Mac DMG
```

## License

No license file is currently included. If you plan to reuse, redistribute, or build on this project publicly, add a license first so contributors know the rules.

## Star, Fork, Snore, Improve

If OpenSnoRE made you laugh, helped you think about sleep, or gave you a strange urge to write Web Audio filters, please:

- star the repo
- fork it
- open an issue with an idea
- send a tiny PR
- build the audio-analysis future

The dream is simple: make snoring less mysterious, make boring situations more survivable, and make the codebase welcoming enough that a curious developer can land a contribution before their tea gets cold.
