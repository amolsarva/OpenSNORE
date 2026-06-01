import React from 'react'

export default function InstallPage({ releasesUrl, shareStatus, onBack, onShare }) {
  return (
    <main className="install-page">
      <button className="ghost-action install-back" onClick={onBack}>
        ← Back to SNORE
      </button>

      <section className="install-hero">
        <span className="section-label">Optional install</span>
        <h1>Keep OpenSnoRE handy.</h1>
        <p>
          The website works without an install. Use one of these options only if you want
          faster access later.
        </p>
      </section>

      <section className="install-grid" aria-label="OpenSnoRE install options">
        <div className="install-card">
          <span className="install-icon">🍎</span>
          <h2>Mac app</h2>
          <p>Download the latest packaged desktop release from GitHub.</p>
          <a className="small-action install-action" href={releasesUrl} target="_blank" rel="noopener noreferrer">
            Open Mac releases
          </a>
        </div>

        <div className="install-card">
          <span className="install-icon">📱</span>
          <h2>iPhone home screen</h2>
          <p>Open this site in Safari, tap Share, then choose Add to Home Screen.</p>
          <small>No App Store download is required.</small>
        </div>

        <div className="install-card">
          <span className="install-icon">↗</span>
          <h2>Send the website</h2>
          <p>Share the live website instead of installing anything.</p>
          <button className="small-action install-action" onClick={onShare}>
            {shareStatus}
          </button>
        </div>
      </section>
    </main>
  )
}
