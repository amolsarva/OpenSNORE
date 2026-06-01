import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const appBaseUrl = new URL(import.meta.env.BASE_URL, window.location.href)
    const serviceWorkerUrl = new URL('sw.js', appBaseUrl)
    navigator.serviceWorker.register(serviceWorkerUrl, {
      scope: appBaseUrl,
    }).catch(() => {
      // Offline support is optional; the app should still run if registration fails.
    })
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
