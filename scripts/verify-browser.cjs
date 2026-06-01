const { app, BrowserWindow } = require('electron')
const { join } = require('node:path')

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function assert(condition, message) {
  if (!condition) {
    throw new Error(`verify-browser: ${message}`)
  }
}

async function inspect(window, script) {
  return window.webContents.executeJavaScript(`(${script})()`)
}

async function click(window, selector) {
  await window.webContents.executeJavaScript(
    `document.querySelector(${JSON.stringify(selector)})?.click()`,
    true,
  )
  await wait(80)
}

async function run() {
  const window = new BrowserWindow({
    show: false,
    useContentSize: true,
    width: 1280,
    height: 720,
    webPreferences: {
      backgroundThrottling: false,
    },
  })

  await window.loadFile(join(__dirname, '..', 'dist', 'index.html'))
  await wait(250)

  const desktop = await inspect(window, () => ({
    pageScrolls: document.documentElement.scrollHeight > window.innerHeight,
    startButtonVisible:
      document.querySelector('[aria-label="Start snoring"]').getBoundingClientRect().bottom <=
      window.innerHeight,
    headerActions: document.querySelector('.header-actions') !== null,
    featuredPersonalities: document.querySelectorAll('.personality-grid.featured .personality-chip').length,
    disclosureCount: document.querySelectorAll('.personality-more, .experiments-more').length,
  }))

  assert(desktop.pageScrolls, 'desktop homepage should scroll when content exceeds the viewport')
  assert(desktop.startButtonVisible, 'desktop primary SNORE button should be visible on first load')
  assert(!desktop.headerActions, 'share and favorite actions should stay hidden before a snore')
  assert(desktop.featuredPersonalities === 3, 'homepage should feature exactly three personalities')
  assert(desktop.disclosureCount === 2, 'homepage should keep secondary content behind two disclosures')

  await click(window, '.home-install-link')
  const install = await inspect(window, () => ({
    title: document.querySelector('.install-hero h1')?.textContent,
    cards: document.querySelectorAll('.install-card').length,
    copy: document.body.textContent,
  }))
  assert(install.title === 'Keep OpenSnoRE handy.', 'install options page title is missing')
  assert(install.cards === 3, 'install options page should show three clear choices')
  assert(install.copy.includes('The website works without an install.'), 'install copy should be optional')

  await click(window, '.install-back')
  await click(window, '.personality-more summary')
  const personalities = await inspect(
    window,
    () =>
      [...document.querySelectorAll('.personality-grid .personality-chip')].filter(
        (button) => button.getClientRects().length > 0,
      ).length,
  )
  assert(personalities > 3, 'personality disclosure should reveal additional personalities')

  await click(window, '.experiments-more summary')
  const experimentsOpen = await inspect(window, () => document.querySelector('.experiments-more').open)
  assert(experimentsOpen, 'experiment disclosure should open')

  window.setContentSize(390, 844)
  await wait(150)
  const mobile = await inspect(window, () => ({
    width: window.innerWidth,
    startButtonVisible:
      document.querySelector('[aria-label="Start snoring"]').getBoundingClientRect().bottom <=
      window.innerHeight,
    sessionStatsDisplay: getComputedStyle(document.querySelector('.home-session-stats')).display,
  }))
  assert(mobile.width <= 640, 'mobile test viewport did not apply')
  assert(mobile.startButtonVisible, 'mobile primary SNORE button should be visible on first load')
  assert(mobile.sessionStatsDisplay === 'grid', 'mobile homepage should expose session stats')

  await click(window, '[aria-label="Start snoring"]')
  const started = await inspect(window, () => ({
    buttonLabel: document.querySelector('.snore-btn').getAttribute('aria-label'),
    agentOnline: document.querySelector('.agent-dot').classList.contains('online'),
    hasShareAction: document.querySelector('.header-actions .share-btn') !== null,
    hasStarAction: document.querySelector('.header-actions .star-link') !== null,
  }))
  assert(started.buttonLabel === 'Stop snoring', 'SNORE button should become a stop control')
  assert(started.agentOnline, 'agent indicator should turn on after starting')
  assert(started.hasShareAction && started.hasStarAction, 'share and GitHub actions should appear after the first snore')

  await click(window, '[aria-label="Stop snoring"]')
  const stopped = await inspect(
    window,
    () => document.querySelector('.snore-btn').getAttribute('aria-label'),
  )
  assert(stopped === 'Start snoring', 'stop control should return to the idle state')

  window.destroy()
  console.log('verify-browser: browser regression checks passed')
}

const timeout = setTimeout(() => {
  console.error('verify-browser: timed out')
  app.exit(1)
}, 15000)

app
  .whenReady()
  .then(run)
  .then(() => {
    clearTimeout(timeout)
    app.quit()
  })
  .catch((error) => {
    clearTimeout(timeout)
    console.error(error.message)
    app.exit(1)
  })
