# Deployment Notes

## Current Setup

OpenSnoRE is a Vite/React app. The browser cannot run the source app directly
from `src/main.jsx`; production must serve the compiled files from `dist/`.

Current public URL:

```text
https://amolsarva.github.io/OpenSNORE/
```

Current GitHub Pages settings:

- Source: `gh-pages` branch, `/`
- Custom domain: none
- Built files are published to `gh-pages`
- The working production HTML contains compiled asset tags like
  `./assets/index-*.js` and `./assets/index-*.css`

## What Happened

The site appeared to load but rendered blank because GitHub Pages was serving
the raw repository root from the `website` branch. That root `index.html`
referenced:

```html
<script type="module" src="/src/main.jsx"></script>
```

That works in the Vite dev server, but not on static GitHub Pages. GitHub Pages
does not transform JSX, run Vite, or bundle dependencies at request time. The
deployed page must reference built assets from `dist/assets/`.

During the fix, GitHub Pages was also configured with the custom domain
`opensnore.newaiyork.com`. That domain was behind Cloudflare and returned a
`522 Connection timed out`, meaning Cloudflare could not reach its configured
origin. Because GitHub Pages redirects its `github.io` URL to the configured
custom domain, the custom-domain problem also made the otherwise valid GitHub
Pages URL unusable.

The immediate recovery was:

1. Build the app with `npm run build`.
2. Publish the compiled `dist/` output to the `gh-pages` branch.
3. Remove `public/CNAME` so GitHub Pages stops redirecting to the broken
   Cloudflare hostname.
4. Set GitHub Pages to serve `gh-pages` from `/`.
5. Verify the public HTML references `./assets/index-*.js`.
6. Open the live URL in the browser and confirm the React UI renders.

## How To Avoid This Again

Do not treat an HTTP `200` as proof that the app works. A static host can return
`index.html` successfully while the JavaScript bundle is missing, unbuilt, or
pointing at source files that the browser cannot execute.

Before changing deployment, run the full local verifier:

```bash
npm run verify
```

That command checks the local Snore Lab analyzer, builds the app, and verifies
the production `dist/` paths used by GitHub Pages. To inspect the built HTML
manually, run:

```bash
npm run build
sed -n '1,80p' dist/index.html
```

The built `dist/index.html` should contain a compiled script path similar to:

```html
<script type="module" crossorigin src="./assets/index-xxxxx.js"></script>
```

It should not contain:

```html
<script type="module" src="/src/main.jsx"></script>
```

After publishing, verify the live site:

```bash
curl -L https://amolsarva.github.io/OpenSNORE/ | grep 'assets/index-'
curl -I https://amolsarva.github.io/OpenSNORE/assets/<current-built-js-file>
```

Then open the site in a browser and confirm visible app text such as
`OpenSnoRE attends boring situations so you do not have to.` appears. Also click
the main `SNORE` button to make sure the loaded JavaScript is interactive.

## Custom Domain Advice

Only re-enable `opensnore.newaiyork.com` after DNS and Cloudflare are confirmed
healthy.

A healthy GitHub Pages custom domain should use GitHub Pages DNS targets, not a
stale or unreachable origin. If Cloudflare proxies the hostname, confirm the
origin is reachable from Cloudflare and that SSL mode is compatible with GitHub
Pages. A Cloudflare `522` is not an app bug; it is an origin connectivity
problem.

When testing a custom domain, verify both URLs:

```bash
curl -I https://amolsarva.github.io/OpenSNORE/
curl -I https://opensnore.newaiyork.com/
```

Do not add `public/CNAME` back until `https://opensnore.newaiyork.com/` renders
the built app in a browser. Adding `CNAME` too early makes GitHub Pages redirect
the working `github.io` URL to the broken custom hostname.

## Maintainer Checklist

- Keep production pointed at `https://amolsarva.github.io/OpenSNORE/` until the
  custom domain is fixed.
- Keep `public/CNAME` absent unless the custom domain has been verified.
- Never publish the repository root as the website for this Vite app.
- Publish `dist/` output, or use a Pages workflow that uploads `dist/`.
- Verify the rendered browser UI, not just the build log.
