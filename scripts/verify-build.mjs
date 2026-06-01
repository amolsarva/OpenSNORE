import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const dist = join(root, 'dist')
const indexPath = join(dist, 'index.html')
const manifestPath = join(dist, 'manifest.json')
const serviceWorkerPath = join(dist, 'sw.js')
const publicCnamePath = join(root, 'public', 'CNAME')
const distCnamePath = join(dist, 'CNAME')

function fail(message) {
  console.error(`verify-build: ${message}`)
  process.exitCode = 1
}

function readRequired(path, label) {
  if (!existsSync(path)) {
    fail(`${label} is missing`)
    return ''
  }
  return readFileSync(path, 'utf8')
}

const indexHtml = readRequired(indexPath, 'dist/index.html')
const manifestJson = readRequired(manifestPath, 'dist/manifest.json')
const serviceWorker = readRequired(serviceWorkerPath, 'dist/sw.js')

if (existsSync(publicCnamePath)) {
  fail('public/CNAME exists; keep GitHub Pages on amolsarva.github.io/OpenSNORE until the custom domain is verified')
}

if (existsSync(distCnamePath)) {
  fail('dist/CNAME exists; keep GitHub Pages on amolsarva.github.io/OpenSNORE until the custom domain is verified')
}

if (indexHtml.includes('/src/main.jsx')) {
  fail('dist/index.html still references raw Vite source')
}

if (!/src="\.\/assets\/index-[^"]+\.js"/.test(indexHtml)) {
  fail('dist/index.html does not reference a relative built JS asset')
}

if (!/href="\.\/assets\/index-[^"]+\.css"/.test(indexHtml)) {
  fail('dist/index.html does not reference a relative built CSS asset')
}

if (!indexHtml.includes('href="./manifest.json"')) {
  fail('manifest link must stay relative for GitHub Pages subpath deploys')
}

if (!indexHtml.includes('href="./apple-touch-icon.png"')) {
  fail('Apple touch icon link must stay relative for GitHub Pages subpath deploys')
}

let manifest
try {
  manifest = JSON.parse(manifestJson)
} catch (error) {
  fail(`dist/manifest.json is invalid JSON: ${error.message}`)
}

if (manifest) {
  if (manifest.start_url !== './') {
    fail('manifest start_url must be "./" for GitHub Pages subpath installs')
  }
  if (manifest.scope !== './') {
    fail('manifest scope must be "./" for GitHub Pages subpath installs')
  }
  for (const icon of manifest.icons || []) {
    if (typeof icon.src === 'string' && icon.src.startsWith('/')) {
      fail(`manifest icon ${icon.src} is root-relative`)
    }
  }
}

for (const badPath of ['/manifest.json', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png', '/index.html']) {
  if (serviceWorker.includes(badPath)) {
    fail(`service worker contains root-relative cache path ${badPath}`)
  }
}

if (!process.exitCode) {
  console.log('verify-build: production build paths look deployable')
}
