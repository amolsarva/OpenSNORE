# Contributing to OpenSnoRE

OpenSnoRE is playful, but contributions should still be careful, small, and honest.

## Best First Contributions

- Add a new snore personality in `src/audio/snoreEngine.js`.
- Add one boring situation in `src/components/SituationPicker.jsx`.
- Add or improve a guided exercise in `src/data/exercises.js`.
- Improve mobile spacing or PWA polish.
- Add accessibility improvements.
- Improve copy that helps people try the live app and star the project.

## Contribution Style

- Keep pull requests focused.
- Include screenshots or short recordings for UI changes.
- Describe audio changes in plain language.
- Keep health claims conservative and evidence-aware.
- Prefer local-first behavior for any audio or sleep data.
- Do not add a backend requirement without a clear reason.

## Health And Safety

OpenSnoRE is not a medical device. Contributions should not imply diagnosis,
treatment, or guaranteed health outcomes. If you add health-related copy, keep it
plain, cautious, and compatible with the README health note.

## Local Setup

```bash
npm ci
npm run dev
```

The local app usually opens at:

```text
http://localhost:5173
```

Before opening a pull request, run:

```bash
npm run verify
```

## Deployment Safety

Before changing public URLs, GitHub Pages settings, `public/CNAME`, or the
`gh-pages` branch, read [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). This project
must deploy built Vite output from `dist/`; serving the repository root can
return a `200 OK` page that still fails to load the React app.
