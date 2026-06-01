import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const app = readFileSync(join(root, 'src', 'App.jsx'), 'utf8')
const css = readFileSync(join(root, 'src', 'index.css'), 'utf8')
const main = readFileSync(join(root, 'src', 'main.jsx'), 'utf8')
const training = readFileSync(join(root, 'src', 'components', 'StopSnoringPage.jsx'), 'utf8')
const exerciseData = readFileSync(join(root, 'src', 'data', 'exercises.js'), 'utf8')
const installPage = readFileSync(join(root, 'src', 'components', 'InstallPage.jsx'), 'utf8')

function fail(message) {
  console.error(`verify-homepage: ${message}`)
  process.exitCode = 1
}

function requireText(source, text, message) {
  if (!source.includes(text)) fail(message)
}

if (/html,\s*body\s*\{\s*height:\s*100%/.test(css)) {
  fail('html and body must not be locked to viewport height; the homepage needs vertical scrolling')
}

requireText(css, 'overflow-x: clip;', 'app shell must clip only horizontal overflow')
requireText(app, 'className="home-session-stats"', 'mobile session stats are missing')
requireText(app, 'Install options', 'homepage install link is missing')
requireText(app, '<summary>More personalities</summary>', 'secondary personalities must stay behind disclosure')
requireText(app, '<summary>More joke tools and meeting experiments</summary>', 'draft experiments must stay behind disclosure')
requireText(app, 'snoreCount > 0 && (', 'GitHub prompts must stay conditional until after the first snore')
requireText(app, 'opens a page only', 'meeting link opener must disclose that it does not auto-join')
requireText(app, 'Hold Timer Simulation', 'hold timer must remain labeled as a simulation')
requireText(app, 'Name Wake Experiment', 'browser-dependent wake detection must remain labeled as an experiment')

const introIndex = app.indexOf('className="snore-intro"')
const snoreIndex = app.indexOf("aria-label={isSnoring ? 'Stop snoring' : 'Start snoring'}")
const installIndex = app.indexOf('Install options')
const personalityIndex = app.indexOf('<h3 className="section-label">Snore Personality</h3>')
const experimentsIndex = app.indexOf('<summary>More joke tools and meeting experiments</summary>')

if (![introIndex, snoreIndex, installIndex, personalityIndex, experimentsIndex].every((index) => index >= 0)) {
  fail('homepage primary sections are missing')
} else if (!(introIndex < snoreIndex && snoreIndex < installIndex && installIndex < personalityIndex && personalityIndex < experimentsIndex)) {
  fail('homepage order regressed; SNORE must appear before install, personalities, and experiments')
}

const featuredMatch = app.match(/const FEATURED_PERSONALITY_IDS = \[([^\]]+)\]/)
const featuredIds = featuredMatch?.[1].match(/'[^']+'/g) || []
if (featuredIds.length !== 3) {
  fail(`expected exactly 3 featured personalities, found ${featuredIds.length}`)
}

requireText(main, "new URL(import.meta.env.BASE_URL, window.location.href)", 'service worker base URL must resolve relative to the current deployed page')
requireText(main, "new URL('sw.js', appBaseUrl)", 'service worker script must resolve relative to the app base URL')
requireText(main, 'scope: appBaseUrl', 'service worker scope must use the resolved app base URL')

const pagesUrl = new URL('sw.js', new URL('./', 'https://amolsarva.github.io/OpenSNORE/')).href
if (pagesUrl !== 'https://amolsarva.github.io/OpenSNORE/sw.js') {
  fail(`GitHub Pages service worker URL resolved incorrectly: ${pagesUrl}`)
}

for (const disallowedClaim of [
  'Muscle, not anatomy',
  'Tongue posture matters most',
  'Singing actually works',
  'complete evidence-based protocol',
  'Most snorers',
  'keeps the airway clear',
  "therapy you'll ever be prescribed",
]) {
  if (`${training}\n${exerciseData}`.includes(disallowedClaim)) {
    fail(`training copy still contains absolute claim: ${disallowedClaim}`)
  }
}

requireText(training, 'signs of sleep apnea or another sleep disorder', 'training page must include a medical follow-up prompt')
requireText(installPage, 'The website works without an install.', 'install page must explain that installation is optional')
requireText(installPage, 'No App Store download is required.', 'install page must explain the iPhone home-screen option')

const unsafeExercisePhrases = [
  'Press your ENTIRE tongue',
  'Keep pressing hard',
  'that means it worked',
  'as wide as possible',
  'Lungs fully empty',
  'ONLY your belly hand should rise',
  'perfect form',
  'Fill your lungs to capacity',
]

for (const phrase of unsafeExercisePhrases) {
  if (exerciseData.includes(phrase)) {
    fail(`exercise copy still contains forceful instruction: ${phrase}`)
  }
}

if (!process.exitCode) {
  console.log('verify-homepage: first-run hierarchy, Pages scope, and trust copy look intentional')
}
