import React from 'react'
import { createRoot } from 'react-dom/client'
import { Activity, ArrowRight, BrainCircuit, ChevronDown, CircleHelp, Layers3, MapPin, Search, Sparkles, ThermometerSun, Wind, Zap } from 'lucide-react'
import './styles.css'

const steps = ['Observe', 'Understand', 'Predict', 'Simulate', 'Recommend', 'Act']

function App() {
  const [question, setQuestion] = React.useState('Analyze urban heat risk in Delhi and identify where intervention could have the greatest potential impact.')
  const [running, setRunning] = React.useState(false)
  const [activeStep, setActiveStep] = React.useState(2)

  const runAnalysis = () => {
    setRunning(true)
    setActiveStep(0)
    let step = 0
    const timer = window.setInterval(() => {
      step += 1
      setActiveStep(Math.min(step, steps.length - 1))
      if (step >= steps.length - 1) {
        window.clearInterval(timer)
        setRunning(false)
      }
    }, 650)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark"><span /></span><div><strong>ASTRA</strong><small>CLIMATE</small></div></div>
        <div className="topbar-center"><span className="live-dot" /> ENVIRONMENTAL INTELLIGENCE <span className="slash">/</span> DELHI NODE</div>
        <button className="icon-button" aria-label="Help"><CircleHelp size={18} /></button>
      </header>

      <section className="workspace">
        <aside className="sidebar">
          <div className="eyebrow">INTELLIGENCE MODES</div>
          <button className="mode active"><ThermometerSun size={17} /><span>Urban Heat</span><small>01</small></button>
          <button className="mode"><Wind size={17} /><span>Air Quality</span><small>02</small></button>
          <button className="mode"><Layers3 size={17} /><span>Land & Water</span><small>03</small></button>
          <button className="mode"><Activity size={17} /><span>Climate Risk</span><small>04</small></button>
          <div className="sidebar-bottom"><div className="system-status"><span className="live-dot" /><div><b>ENGINE ONLINE</b><small>Evidence pipeline ready</small></div></div></div>
        </aside>

        <section className="main-panel">
          <div className="hero-copy">
            <div className="eyebrow">PHYSICAL ENVIRONMENT / 2026.09.16</div>
            <h1>Understand the environment.<br /><em>Engineer what comes next.</em></h1>
            <p>Astra turns Earth observation, weather, geography and scientific knowledge into evidence-backed decisions for physical environments.</p>
          </div>

          <div className="query-card">
            <div className="query-label"><Sparkles size={15} /> ASK ASTRA</div>
            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={3} />
            <div className="query-footer"><div className="location-chip"><MapPin size={14} /> Delhi, India <ChevronDown size={13} /></div><button onClick={runAnalysis} disabled={running}>{running ? 'ANALYZING...' : 'RUN INTELLIGENCE'} <ArrowRight size={16} /></button></div>
          </div>

          <div className="pipeline">
            {steps.map((step, i) => <React.Fragment key={step}><div className={`pipeline-step ${i <= activeStep ? 'done' : ''} ${i === activeStep ? 'current' : ''}`}><span>{String(i + 1).padStart(2, '0')}</span>{step}</div>{i < steps.length - 1 && <div className={`pipeline-line ${i < activeStep ? 'filled' : ''}`} />}</React.Fragment>)}
          </div>

          <div className="insight-grid">
            <article className="insight-card map-card"><div className="card-head"><div><span className="card-kicker">ENVIRONMENTAL STATE</span><h2>Delhi / Urban Heat</h2></div><span className="status-pill">OBSERVED + MODELED</span></div><div className="map"><div className="map-grid" /><div className="heat-shape shape-a" /><div className="heat-shape shape-b" /><div className="heat-shape shape-c" /><div className="map-label label-1">NORTH DELHI</div><div className="map-label label-2">CENTRAL DELHI</div><div className="map-label label-3">SOUTH DELHI</div><div className="crosshair" /><div className="map-tooltip"><b>Current heat signal</b><span>High relative surface temperature</span></div></div></article>
            <article className="insight-card"><div className="card-head"><div><span className="card-kicker">ASTRA TRACE</span><h2>Reasoning state</h2></div><BrainCircuit size={20} /></div><div className="trace"><TraceItem label="Question decomposed" done /><TraceItem label="Weather + geospatial evidence" done /><TraceItem label="Environmental state constructed" done /><TraceItem label="Risk hypotheses generated" active /><TraceItem label="Intervention scenarios" /><TraceItem label="Decision recommendation" /></div><button className="text-button">View evidence <ArrowRight size={14} /></button></article>
          </div>

          <div className="metrics"><Metric label="Surface heat signal" value="HIGH" note="relative anomaly" /><Metric label="Exposure concentration" value="72%" note="modeled population zones" /><Metric label="Confidence" value="0.81" note="evidence agreement" /><Metric label="Data freshness" value="LIVE" note="weather + observation" /></div>
        </section>
      </section>
    </main>
  )
}

function TraceItem({ label, done, active }: { label: string; done?: boolean; active?: boolean }) { return <div className={`trace-item ${done ? 'done' : ''} ${active ? 'active' : ''}`}><span>{done ? '✓' : active ? '◉' : '○'}</span>{label}</div> }
function Metric({ label, value, note }: { label: string; value: string; note: string }) { return <div className="metric"><span>{label}</span><strong>{value}</strong><small>{note}</small></div> }

createRoot(document.getElementById('root')!).render(<App />)
