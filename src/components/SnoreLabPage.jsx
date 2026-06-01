import React, { useEffect, useMemo, useRef, useState } from 'react'
import { analyzeAudioBuffer } from '../audio/snoreAnalysis.mjs'

const MAX_RECORDING_SECONDS = 60
const LAB_HISTORY_STORAGE_KEY = 'opensnore.labHistory'

function formatTime(seconds) {
  const safe = Math.max(0, Math.round(seconds))
  const m = Math.floor(safe / 60)
  const s = safe % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatHistoryDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function SnoreLabPage() {
  const [analysis, setAnalysis] = useState(null)
  const [fileName, setFileName] = useState('')
  const [status, setStatus] = useState('Upload a short sleep-audio clip to analyze it locally.')
  const [isBusy, setIsBusy] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [history, setHistory] = useState([])
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const stopTimerRef = useRef(null)

  const report = useMemo(() => {
    if (!analysis) return ''
    return [
      `OpenSnoRE local snore lab report for ${fileName || 'audio sample'}`,
      `Length: ${formatTime(analysis.duration)}`,
      `Likely snore events: ${analysis.events.length}`,
      `Snore-active time: ${formatTime(analysis.snoreSeconds)} (${analysis.snorePercent}%)`,
      `Pattern: ${analysis.label}`,
      analysis.avgGap ? `Average gap: ${analysis.avgGap.toFixed(1)}s` : 'Average gap: not enough events',
      'This is a local signal estimate, not a diagnosis.',
    ].join('\n')
  }, [analysis, fileName])

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LAB_HISTORY_STORAGE_KEY)
      if (saved) setHistory(JSON.parse(saved))
    } catch {
      // Analysis history is optional and local-only.
    }
  }, [])

  const recordAnalysis = (nextAnalysis, name) => {
    const summary = {
      id: `${Date.now()}-${name}`,
      name,
      analyzedAt: new Date().toISOString(),
      duration: nextAnalysis.duration,
      events: nextAnalysis.events.length,
      snorePercent: nextAnalysis.snorePercent,
      snoreSeconds: nextAnalysis.snoreSeconds,
      label: nextAnalysis.label,
    }

    setHistory((prev) => {
      const next = [summary, ...prev].slice(0, 8)
      try {
        window.localStorage.setItem(LAB_HISTORY_STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Keep the visible history even if storage is unavailable.
      }
      return next
    })
  }

  const releaseRecording = () => {
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current)
    stopTimerRef.current = null
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  const analyzeBlob = async (blob, name) => {
    setIsBusy(true)
    setAnalysis(null)
    setFileName(name)
    setStatus('Decoding audio locally...')

    try {
      const arrayBuffer = await blob.arrayBuffer()
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) {
        setStatus('This browser cannot decode audio files.')
        setIsBusy(false)
        return
      }
      const ctx = new AudioContext()
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0))
      await ctx.close?.()
      const nextAnalysis = analyzeAudioBuffer(audioBuffer)
      setAnalysis(nextAnalysis)
      recordAnalysis(nextAnalysis, name)
      setStatus('Analysis complete. No audio left your device.')
    } catch {
      setAnalysis(null)
      setStatus('Could not decode that file. Try m4a, mp3, wav, or a shorter clip.')
    } finally {
      setIsBusy(false)
    }
  }

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    analyzeBlob(file, file.name)
    event.target.value = ''
  }

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setStatus('This browser cannot record audio here. Upload a clip instead.')
      return
    }

    try {
      setAnalysis(null)
      setStatus('Requesting microphone access...')
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : ''
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)

      chunksRef.current = []
      streamRef.current = stream
      recorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data?.size) chunksRef.current.push(event.data)
      }

      recorder.onstop = () => {
        setIsRecording(false)
        releaseRecording()
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        chunksRef.current = []
        if (!blob.size) {
          setStatus('Recording stopped without audio data. Try again or upload a clip.')
          return
        }
        analyzeBlob(blob, `browser-recording-${new Date().toISOString().slice(0, 19)}.webm`)
      }

      recorder.start()
      setIsRecording(true)
      setStatus(`Recording locally. Stop when you have a sample; auto-stops at ${MAX_RECORDING_SECONDS}s.`)
      stopTimerRef.current = setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop()
      }, MAX_RECORDING_SECONDS * 1000)
    } catch {
      releaseRecording()
      setIsRecording(false)
      setStatus('Microphone access failed or was denied. Upload a clip instead.')
    }
  }

  const stopRecording = () => {
    const recorder = recorderRef.current
    if (recorder?.state === 'recording') {
      setStatus('Finalizing recording...')
      recorder.stop()
    }
  }

  useEffect(() => {
    return () => {
      if (recorderRef.current?.state === 'recording') {
        recorderRef.current.ondataavailable = null
        recorderRef.current.onstop = null
        recorderRef.current.stop()
      }
      releaseRecording()
    }
  }, [])

  const copyReport = async () => {
    if (!report) return
    try {
      await navigator.clipboard.writeText(report)
      setStatus('Report copied.')
    } catch {
      setStatus('Copy failed; select the report text manually.')
    }
  }

  const clearHistory = () => {
    setHistory([])
    try {
      window.localStorage.removeItem(LAB_HISTORY_STORAGE_KEY)
    } catch {
      // Local-only cleanup can fail in locked-down storage contexts.
    }
    setStatus('Local analysis history cleared.')
  }

  const historyDelta =
    history.length > 1 ? history[0].snorePercent - history[1].snorePercent : null

  return (
    <main className="lab-page">
      <section className="lab-hero">
        <div>
          <span className="section-label">Local-first snore analysis</span>
          <h1>Upload a clip. Get a rough snore map. Keep the audio here.</h1>
          <p>
            Snore Lab estimates likely snore events from the audio envelope in your browser.
            It is useful for experiments and before/after comparisons, not medical diagnosis.
          </p>
        </div>
        <div className="lab-actions">
          <label className="upload-card">
            <input type="file" accept="audio/*" onChange={handleFile} disabled={isBusy || isRecording} />
            <span className="upload-icon">↥</span>
            <strong>{isBusy ? 'Analyzing...' : 'Choose audio'}</strong>
            <small>m4a, mp3, wav, webm</small>
          </label>
          <button
            className={`record-card ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isBusy}
            aria-pressed={isRecording}
            type="button"
          >
            <span className="upload-icon">{isRecording ? '■' : '●'}</span>
            <strong>{isRecording ? 'Stop recording' : 'Record sample'}</strong>
            <small>up to {MAX_RECORDING_SECONDS}s, local only</small>
          </button>
        </div>
      </section>

      <div className="lab-status" role="status" aria-live="polite">{status}</div>

      {history.length > 0 && (
        <section className="lab-history" aria-label="Recent local analysis history">
          <div className="lab-history-head">
            <div>
              <span className="section-label">Local history</span>
              <h2>Recent analyses</h2>
            </div>
            <button className="ghost-action" onClick={clearHistory}>
              Clear history
            </button>
          </div>
          {historyDelta !== null && (
            <div className={`trend-callout ${historyDelta <= 0 ? 'better' : 'worse'}`}>
              <strong>{historyDelta === 0 ? 'No change' : `${Math.abs(historyDelta)}% ${historyDelta < 0 ? 'lower' : 'higher'}`}</strong>
              <span>snore-active time than the previous local sample</span>
            </div>
          )}
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-row">
                <div>
                  <strong>{item.name}</strong>
                  <span>{formatHistoryDate(item.analyzedAt)}</span>
                </div>
                <div className="history-stats">
                  <span>{item.label}</span>
                  <span>{item.events} events</span>
                  <span>{item.snorePercent}% active</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {analysis ? (
        <>
          <section className="lab-metrics" aria-label="Snore analysis metrics">
            <div className="lab-metric">
              <span>Pattern</span>
              <strong>{analysis.label}</strong>
            </div>
            <div className="lab-metric">
              <span>Likely events</span>
              <strong>{analysis.events.length}</strong>
            </div>
            <div className="lab-metric">
              <span>Snore-active</span>
              <strong>{analysis.snorePercent}%</strong>
            </div>
            <div className="lab-metric">
              <span>Length</span>
              <strong>{formatTime(analysis.duration)}</strong>
            </div>
          </section>

          <section className="timeline-panel">
            <div className="timeline-head">
              <div>
                <span className="section-label">Timeline</span>
                <h2>{fileName}</h2>
              </div>
              <button className="small-action" onClick={copyReport}>
                Copy report
              </button>
            </div>
            <div className="snore-timeline" aria-label="Audio intensity timeline">
              {analysis.windows.map((window) => (
                <span
                  key={window.start}
                  className={`timeline-bar ${window.active ? 'active' : ''}`}
                  style={{ height: `${Math.max(6, window.score)}%` }}
                  title={`${formatTime(window.start)} intensity ${window.score}`}
                />
              ))}
            </div>
            <div className="timeline-legend">
              <span>0:00</span>
              <span>{formatTime(analysis.duration)}</span>
            </div>
          </section>

          <section className="events-panel">
            <div>
              <span className="section-label">Detected stretches</span>
              <h2>Likely snore events</h2>
            </div>
            {analysis.events.length ? (
              <div className="event-list">
                {analysis.events.slice(0, 12).map((event, index) => (
                  <div key={`${event.start}-${event.end}`} className="event-row">
                    <span>{index + 1}</span>
                    <strong>
                      {formatTime(event.start)} - {formatTime(event.end)}
                    </strong>
                    <small>{event.duration.toFixed(1)}s</small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-events">
                No clear snore-like stretches crossed the current threshold. Try a louder or longer
                sample if you expected more activity.
              </p>
            )}
          </section>
        </>
      ) : (
        <section className="lab-guide">
          <div>
            <span className="section-label">Good first sample</span>
            <p>Use a 30-second to 5-minute clip with the phone near the bed and low background noise.</p>
          </div>
          <div>
            <span className="section-label">What it checks</span>
            <p>RMS loudness windows, quiet-floor estimates, active stretches, and rough timing gaps.</p>
          </div>
          <div>
            <span className="section-label">What it does not do</span>
            <p>It does not diagnose sleep apnea, classify anatomy, or replace a sleep study.</p>
          </div>
        </section>
      )}
    </main>
  )
}
