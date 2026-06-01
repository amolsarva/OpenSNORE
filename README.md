# OpenSnoRE

**The open-source snoring app you can try right now: fake snores for boring moments, real exercises for quieter nights, and one very important Star button.**

[![Deploy to GitHub Pages](https://github.com/amolsarva/OpenSNORE/actions/workflows/deploy.yml/badge.svg)](https://github.com/amolsarva/OpenSNORE/actions/workflows/deploy.yml)
[![Build Mac App](https://github.com/amolsarva/OpenSNORE/actions/workflows/build-mac.yml/badge.svg)](https://github.com/amolsarva/OpenSNORE/actions/workflows/build-mac.yml)

OpenSnoRE attends boring situations so you do not have to. It is a browser app, a Mac app, a PWA, a joke with surprisingly practical edges, and a small open-source bet that snoring can be less mysterious.

**Live app:** [amolsarva.github.io/OpenSNORE](https://amolsarva.github.io/OpenSNORE/)<br>
**Download:** [latest Mac release](https://github.com/amolsarva/OpenSNORE/releases/latest)<br>
**Main request:** star this GitHub page

**Deployment note:** before changing public URLs, GitHub Pages settings, or
`public/CNAME`, read [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Project Update: The Snore Has Escaped

OpenSnoRE started as a ridiculous question: what if the world's most boring
moments had a tiny local agent that could snore on your behalf? It now has an
answer you can actually click.

What is working today:

- **A live GitHub Pages app** at [amolsarva.github.io/OpenSNORE](https://amolsarva.github.io/OpenSNORE/)
  that runs the real React build instead of raw source files.
- **A procedural snore engine** that generates snores with Web Audio instead of
  shipping canned sound clips.
- **Eight snore personalities** ranging from polite little nap energy to
  mattress-subwoofer disaster.
- **Boredom theater:** situations, endurance timers, fake attentiveness lines,
  hold-mode timing, wake-up phrases, meeting alibis, and a 20-second demo that
  lands the joke fast.
- **Share and star loops** built into both the app and this README, because the
  project grows when someone clicks, laughs, and sends the link onward.
- **A real stop-snoring side quest:** guided tongue, throat, jaw, and breathing
  exercises with timed steps, programs, local practice streaks, and careful
  health framing.
- **A local Snore Lab:** upload or record a short clip, estimate likely snore
  stretches, compare recent local samples, see a simple timeline, and copy a
  cautious report without sending audio to a server.
- **PWA and Mac-app foundations:** manifest, service worker, Electron wrapper,
  GitHub Actions for Pages deploys, and release plumbing for downloadable builds.
- **Deployment guardrails:** the app is now pointed at the working GitHub Pages
  URL, with notes explaining why the broken Cloudflare custom domain should stay
  out of the path until DNS is fixed and browser-verified.

The vibe is now clear: OpenSnoRE is half prank, half practical sleep experiment,
and all open-source invitation. It should stay instant to try, funny enough to
share, honest enough not to overclaim, and small enough that a contributor can
improve one tiny corner without needing a map and a week of courage.

What remains is the truly interesting part:

1. **Make the phone experience excellent.** The live site is the front door, so
   mobile audio, install prompts, layout polish, offline behavior, and iPhone
   quirks matter more than almost anything.
2. **Turn exercise mode into a better tiny coach.** Add reminders, calmer
   pacing, richer progress history, voice guidance, and stronger programs
   without making medical promises the app cannot keep.
3. **Build deeper local-first snore analysis.** Add spectral features, better
   event classification, cleaner before/after comparisons, and keep recordings
   private by default.
4. **Make the evidence library stronger.** Cite the research, explain what each
   exercise targets, separate solid evidence from promising evidence, and keep
   the health language precise.
5. **Polish the desktop path.** Add proper app icons, signing/notarization,
   auto-update thinking, and maybe Windows/Linux builds once the web experience
   earns it.
6. **Invite the internet to make it weirder.** Community snore packs, better
   boring situations, tiny achievements, silly share reports, and small PRs are
   how the project becomes alive instead of merely available.

The greatest-potential version of OpenSnoRE is not just a snore button. It is a
privacy-respecting sleep-audio playground, a gentle exercise coach, and a
strangely memorable open-source artifact that people can understand in five
seconds and improve in an afternoon.

## Try It Now

OpenSnoRE is ready to test instantly. No signup, no setup, no terminal, no developer brain required.

**[Open amolsarva.github.io/OpenSNORE](https://amolsarva.github.io/OpenSNORE/)**

Click the site, press the snore button, and you are in. You can test the snore generator, boredom mode, stop-snoring exercises, and local Snore Lab directly in your browser.

Want it on your device?

- **Mac:** download the latest app from [GitHub Releases](https://github.com/amolsarva/OpenSNORE/releases/latest)
- **iPhone:** open [amolsarva.github.io/OpenSNORE](https://amolsarva.github.io/OpenSNORE/) in Safari, tap Share, then Add to Home Screen
- **Browser:** keep using [amolsarva.github.io/OpenSNORE](https://amolsarva.github.io/OpenSNORE/)

**Most important: star this GitHub page.** That is the main growth path for OpenSnoRE. If you laugh, test it, share it, or want the project to keep going, hit Star before you leave.

## Choose Your Path

| I want to... | Do this |
| --- | --- |
| Try it immediately | Open [amolsarva.github.io/OpenSNORE](https://amolsarva.github.io/OpenSNORE/) |
| Use it like an app | Add the website to your iPhone Home Screen |
| Download it | Grab the [latest Mac release](https://github.com/amolsarva/OpenSNORE/releases/latest) |
| Help without coding | Star this GitHub page |
| Make it better | Fork it and add one small thing |
| Explain it quickly | Use the share copy below |

## The 30-Second Test

1. Open [amolsarva.github.io/OpenSNORE](https://amolsarva.github.io/OpenSNORE/)
2. Turn your volume down to a sane level
3. Press the snore button
4. Try a different snore personality
5. Open the stop-snoring tab and preview an exercise
6. Upload a short sample in Snore Lab if you have one
7. Come back here and star the page

That is the whole funnel. Website first. Download only if you want it. Star this page if the idea deserves oxygen.

## One-Line Pitch

OpenSnoRE is a free, open-source snoring app: instant synthetic snores for boring situations, guided exercises for real snoring, and a growing lab for privacy-respecting sleep-audio experiments.

## Why It Exists

Because snoring sits at a strange intersection:

- it is funny until it ruins sleep
- it is common but poorly understood by most people
- it can be harmless, annoying, or clinically important
- it is perfect for local-first audio experiments
- it deserves tools that are playful without being misleading

OpenSnoRE starts with the lowest-friction version of that idea: click a website, make a snore, try an exercise, star the page, and help pull the next version into existence.

Today, that means it mostly:

- generates synthetic snores
- waits on hold
- pretends to listen
- wakes up in a staged demo when someone says your name

Eventually, it should become a more plausible agent for meetings, hold queues, and other coordination rituals that did not need to exist.

OpenSnoRE is a small, weird, useful React app that does two things:

1. It generates theatrical synthetic snoring for moments of maximum boredom.
2. It gives you guided, evidence-inspired myofunctional exercises that may help reduce real snoring over time.

It is part toy, part wellness experiment, part audio sandbox, and part invitation to build the world's friendliest open-source snoring lab.

## Why Star It

OpenSnoRE is the kind of project that spreads by people seeing it, trying it, laughing, and remembering it exists. A GitHub star is the easiest public signal that helps that happen.

Stars matter here because they:

- make the project easier to discover
- show that the live demo is worth maintaining
- encourage people to contribute new personalities and exercises
- make future releases feel less like shouting into the void
- create a simple public scoreboard for whether the idea has momentum

Star this page if you want:

- more snore personalities
- better phone install support
- sleep-audio analysis experiments
- a more polished Mac app
- more guided exercises
- a weirder, friendlier open-source health toy

You do not need to contribute code to help. Click the live site, star this page, and share [amolsarva.github.io/OpenSNORE](https://amolsarva.github.io/OpenSNORE/) with someone trapped in a boring call.

## What Makes It Different

- **Instant web demo:** the main experience runs at [amolsarva.github.io/OpenSNORE](https://amolsarva.github.io/OpenSNORE/)
- **No account:** open it and test it
- **No backend today:** the current app runs locally in the browser or Electron shell
- **Procedural audio:** snores are generated live, not shipped as static sound files
- **Real usefulness hiding inside the joke:** guided myofunctional exercises sit next to the snore machine
- **Built-in sharing loop:** the app now has share and star prompts so the live demo can spread from inside the product
- **Viral demo toys:** missions, snore reports, meeting alibis, achievements, and lifetime local stats make it easy to share the bit
- **Local Snore Lab:** audio uploads are decoded in the browser for rough snore-event timelines
- **Open-source expansion path:** personalities, exercises, accessibility, PWA polish, and analysis tools are all approachable contribution areas

## What It Does Today

### Snore Mode

Press the big button and OpenSnoRE becomes your personal anti-productivity assistant. It makes synthetic snores live in the browser, adds just enough office-theater absurdity, and gives you knobs to change the vibe.

Use it for:

- testing the joke in five seconds
- surviving pretend boredom with theatrical commitment
- experimenting with procedural snore sounds
- demonstrating the app to someone who has no patience for setup

Live features:

- adjustable synthetic snore engine
- mission generator for viral demo prompts
- shareable snore score report
- local lifetime snore stats
- unlockable achievements
- meeting alibi generator
- executive breathing mode
- iPhone audio test/status messaging
- wait-on-hold timer and visualizer
- fake attentiveness phrases
- manual transcript wake detection
- one-tap meeting demo: snores, gets called on, says "Sorry, I was on mute."

Experimental features:

- microphone wake detection in browsers with `SpeechRecognition` / `webkitSpeechRecognition`

Coming soon:

- real meeting auto-join
- lobby handling
- reliable cross-browser microphone transcription
- useful meeting summaries

Current snore personalities:

- **The Gentleman**: subtle, dignified, almost apologetic.
- **The Chainsaw**: industrial, relentless, emotionally unavailable.
- **The Harmonist**: musical enough to be suspicious.
- **The Freight Train**: deep, low, tectonic.
- **The Espresso Machine**: hissing, gurgling, and over-caffeinated.
- **The Harbor Fog Horn**: long, low, maritime, and deeply inconvenient.
- **The Tiny Polite Nap**: small, courteous, and barely unionized.
- **The Subwoofer**: wall-rattling bass from under a mattress.

Under the hood, these are generated live with the Web Audio API. No snore files are shipped. The app synthesizes pink noise, shapes it through filters, adds envelopes, sweeps resonances, applies optional distortion, and occasionally gets a little too proud of itself.

### Bored-O-Meter

Choose what you are suffering through and let OpenSnoRE score the modern tragedy:

- team standup
- quarterly review
- mandatory HR training
- terms and conditions
- NFT pitch meeting
- synergy discussion
- and other tragic modern experiences

The app tracks your endured time, snore count, and boredom level. This is not science. This is office anthropology.

### Stop Snoring

OpenSnoRE also includes guided exercises for the throat, tongue, jaw, soft palate, and breathing patterns. The goal is simple: make the useful part easy to try, timed, and non-intimidating.

Use it when you want:

- a quick throat or tongue exercise
- a calmer pre-sleep routine
- a guided timer instead of a vague checklist
- a low-pressure way to explore myofunctional exercises

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

There is also a local practice coach. When you complete an exercise, OpenSnoRE
stores a small summary in this browser: session count, minutes practiced, a
current-day streak, the last completed exercise, and a seven-day practice strip.
It does not upload anything or create an account.

### Snore Lab

Snore Lab is the first real step toward the audio-analysis future. Upload or
record a short audio clip and OpenSnoRE decodes it locally in the browser,
estimates likely snore-active stretches from the loudness envelope, renders a
timeline, saves recent local summaries, and generates a copyable report.

It currently does:

- local file decoding with the Web Audio API
- browser microphone recording for short local samples
- rough quiet-floor and active-window detection
- likely snore-event grouping
- snore-active percentage
- timeline visualization
- recent local analysis history
- latest-vs-previous snore-active comparison
- copyable report text

It does not diagnose sleep apnea, identify anatomy, or replace a sleep study.
The next version should add spectral features, better event classification, and
cleaner before/after comparisons across exercise programs.

## Who It Is For

- **People who want to try it instantly:** click [amolsarva.github.io/OpenSNORE](https://amolsarva.github.io/OpenSNORE/)
- **People who want an app-like version:** install it on iPhone or download the Mac build
- **People who snore:** try the guided exercises and read the health note below
- **People who build things:** fork it, add a snore personality, improve the PWA, or help with audio analysis
- **People who just enjoyed the bit:** star this page and keep moving

## Install Options

You do not have to install anything. The website is the default experience.

If you still want it closer to your device:

- **Use the website:** [amolsarva.github.io/OpenSNORE](https://amolsarva.github.io/OpenSNORE/)
- **Install on iPhone:** open the website in Safari, tap Share, then Add to Home Screen
- **Download for Mac:** use the [latest GitHub release](https://github.com/amolsarva/OpenSNORE/releases/latest)

If you are unsure which one to pick, use the website first. It is the fastest test and the best link to share.

## Important Health Note

OpenSnoRE is not a medical device, diagnostic tool, or replacement for clinical care.

Snoring can be harmless, annoying, relationship-damaging, or a symptom of obstructive sleep apnea. If snoring is loud, chronic, associated with choking/gasping, daytime sleepiness, morning headaches, high blood pressure, or witnessed breathing pauses, please talk to a qualified clinician or sleep specialist.

The exercises here are inspired by myofunctional therapy research, but the app does not diagnose conditions or guarantee outcomes.

## Tech Stack

- **React 18**
- **Vite 5**
- **Web Audio API**
- **Web Speech API** where available for experimental wake detection
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

Run the full local verifier:

```bash
npm run verify
```

That checks the local Snore Lab analyzer, builds the web app, and verifies that
the production `dist/` paths are deployable on GitHub Pages.

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

The web app deploys to GitHub Pages from the `gh-pages` branch using `.github/workflows/deploy.yml`.
The current production URL is [amolsarva.github.io/OpenSNORE](https://amolsarva.github.io/OpenSNORE/).
Do not restore `public/CNAME` or point the app back at `opensnore.newaiyork.com`
until the Cloudflare/DNS issue is fixed and the custom domain has been verified
in a browser. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) before touching deploy
settings.

Tagged releases matching `v*` can trigger the Mac app workflow in `.github/workflows/build-mac.yml`, which builds a DMG and uploads it to the GitHub release.

## Wishlist

This is where forks can get interesting. If OpenSnoRE gets stars, this is the roadmap people are voting for.

The highest-leverage future is obvious:

1. make the instant website feel better on every phone
2. make the Mac app easier to trust and download
3. add real sleep-audio analysis without creepy data collection
4. make the guided exercises feel like a tiny coach
5. keep the joke alive without making the health side sloppy

### Audio Recording Upload + Snore Analysis

Let users upload a sleep audio recording and get a useful, privacy-respecting analysis of what is happening. The north star is local-first: your recording should not need to leave your machine just to get a useful signal.

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

Add new procedural snore characters. This is the fastest, funniest way to make the app feel bigger:

- The Espresso Machine
- The Harbor Fog Horn
- The Haunted Accordion
- The Startup Founder Breathing Through A Pitch Deck
- The Tiny Polite Nap
- The Subwoofer Under A Mattress

Bonus points for personalities that are funny in the UI and meaningfully different in the audio graph.

The dream here is a community snore pack: a tiny gallery of ridiculous, named, procedural snores that people can test instantly on the website.

### Better Exercise Coaching

The exercises should feel calm, guided, and easy to finish. Ideas:

- reminders
- adaptive programs
- form tips
- voice-guided exercise mode
- "quiet mode" for doing exercises near sleeping people
- richer progress journal
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

The current service worker is tiny. It can become much better, especially because many people will discover OpenSnoRE on a phone first.

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

Make the repo friendlier for new contributors without making the README feel like a wall of tooling:

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

Looking for a manageable first fork? Read [CONTRIBUTING.md](CONTRIBUTING.md), then try one of these. Small, funny improvements are welcome:

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

## Share Copy

Need a quick way to explain it?

> OpenSnoRE is a free open-source snoring app you can try instantly at amolsarva.github.io/OpenSNORE. It makes synthetic snores for boring situations and includes guided exercises that may help reduce real snoring. Try it, laugh, and star the GitHub page.

Short version:

> Try OpenSnoRE: fake snores for boring calls, real exercises for quieter nights. amolsarva.github.io/OpenSNORE

Even shorter:

> OpenSnoRE: click, snore, star. amolsarva.github.io/OpenSNORE

## Help It Spread

The best way to help OpenSnoRE right now is simple:

1. Open [amolsarva.github.io/OpenSNORE](https://amolsarva.github.io/OpenSNORE/)
2. Try the snore button
3. Star this page
4. Send the website to one person who will understand the joke

That is more useful than a complicated launch plan. The project needs visible interest, quick feedback, and small contributions.

Good places to share it:

- a group chat during a boring meeting
- a sleep or wellness thread
- a Web Audio / React community
- a personal newsletter
- a "weird useful tools" list
- anywhere someone will click a link faster than they will read setup docs

## Design Principles

- **Funny first, useful second, misleading never.**
- **Local by default.** Especially for future audio recording analysis.
- **Tiny surface area.** The app should stay easy to run and fork.
- **No fake diagnosis.** Helpful signals are welcome; medical claims need evidence.
- **Make it inviting.** A contributor should be able to add a personality, exercise, or UI polish without needing a week-long onboarding.

## Scripts

```bash
npm run dev             # start Vite
npm run verify          # analysis check, production build, deploy-path check
npm run build           # build web app
npm run verify:analysis # check Snore Lab analyzer behavior
npm run verify:build    # check built GitHub Pages paths
npm run preview         # preview production build
npm run electron:dev    # run Electron + Vite together
npm run electron:build  # build Mac DMG
```

## License

OpenSnoRE is available under the [MIT License](LICENSE).

## Star This Page

If OpenSnoRE made you laugh, helped you think about sleep, or gave you a reason to survive one more pointless call, please **star this GitHub page**.

That star is the whole growth loop right now. It helps other people discover the live app, makes the project look alive, and tells contributors this is worth improving.

The easiest path:

1. Try it instantly at [amolsarva.github.io/OpenSNORE](https://amolsarva.github.io/OpenSNORE/)
2. Star this page
3. Share the website with one bored person

If you want to go further:

- fork it
- open an issue with an idea
- send a tiny PR
- build the audio-analysis future

The dream is simple: make snoring less mysterious, make boring situations more survivable, and make OpenSnoRE easy enough to try that nobody has to read setup instructions before pressing the snore button.
