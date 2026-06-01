# Agent Notes

Read [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) before changing deploy settings,
public URLs, GitHub Pages configuration, `public/CNAME`, or the `gh-pages`
branch.

Current production URL:

```text
https://amolsarva.github.io/OpenSNORE/
```

Do not point the app back at `opensnore.newaiyork.com` unless Cloudflare/DNS has
been fixed and the URL has been verified in a browser. On 2026-05-26, that host
returned Cloudflare 522 origin timeouts.

Before saying deployment is good, verify all of these:

```bash
npm run build
curl -L https://amolsarva.github.io/OpenSNORE/ | grep 'assets/index-'
curl -I https://amolsarva.github.io/OpenSNORE/assets/<current-built-js-file>
```

Then open the live URL in a browser and confirm the React UI renders. A `200 OK`
HTML response is not enough.
