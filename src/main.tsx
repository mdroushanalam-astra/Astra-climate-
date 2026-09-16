import React from 'react'
import { createRoot } from 'react-dom/client'
import { Activity, ArrowRight, BrainCircuit, ChevronDown, CircleHelp, Layers3, MapPin, Sparkles, ThermometerSun, Wind, RefreshCw } from 'lucide-react'
import './styles.css'
import { observeDelhi, simulateIntervention, type EnvironmentalState } from './intelligence'

const steps = ['Observe', 'Understand', 'Predict', 'Simulate', 'Recommend', 'Act']

function App() {
  const [question, setQuestion] = React.useState('Analyze urban heat risk in Delhi and identify where intervention could have the greatest potential impact.')
  const [running, setRunning] = React.useState(false)
  const [activeStep, setActiveStep] = React.useState(0)
  const [state, setState] = React.useState<EnvironmentalState | null>(null)
  const [error, setError] = React.useState('')
  const [scenario, setScenario] = React.useState<'vegetation' | 'cool-roofs' | 'shade'>('vegetation')

  const runAnalysis = async () => {
    setRunning(true)
    setError('')
    setActiveStep(0)
    try {
      const observed = await observeDelhi()
      setState(observed)
      for (let i = 1; i < steps.length; i++) {
        await wait(420)
        setActiveStep(i)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to retrieve environmental observations.')
    } finally {
      setRunning(false)
    }
  }

  React.useEffect(() => { void runAnalysis() }, [])

  const simulated = state ? simulateIntervention(state, scenario) : null

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
          <div className="sidebar-bottom"><div className="system-status"><span className="live-dot" /><div><b>ENGINE ONLINE</b><small>{state ? 'Live observation connected' : 'Connecting to evidence...'}</small></div></div></div>
        </aside>

        <section className="main-panel">
          <div className="hero-copy">
            <div className="eyebrow">PHYSICAL ENVIRONMENT / DELHI</div>
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

          {error && <div className="error-banner">{error} <button onClick={runAnalysis}><RefreshCw size={13} /> Retry</button></div>}

          <div className="insight-grid">
            <article className="insight-card map-card"><div className="card-head"><div><span className="card-kicker">ENVIRONMENTAL STATE</span><h2>Delhi / Urban Heat</h2></div><span className="status-pill">{state ? 'LIVE OBSERVATION' : 'CONNECTING'}</span></div><div className="map"><div className="map-grid" /><div className="heat-shape shape-a" style={{ opacity: state ? Math.max(.2, state.heatRisk / 150) : .3 }} /><div className="heat-shape shape-b" /><div className="heat-shape shape-c" /><div className="map-label label-1">NORTH DELHI</div><div className="map-label label-2">CENTRAL DELHI</div><div className="map-label label-3">SOUTH DELHI</div><div className="crosshair" /><div className="map-tooltip"><b>{state ? `${state.riskBand} heat-risk signal` : 'Observing...'}</b><span>{state ? `${state.temperature.toFixed(1)}°C · feels ${state.apparentTemperature.toFixed(1)}°C` : 'Retrieving live weather'}</span></div></div></article>
            <article className="insight-card"><div className="card-head"><div><span className="card-kicker">ASTRA TRACE</span><h2>Reasoning state</h2></div><BrainCircuit size={20} /></div><div className="trace"><TraceItem label="Question decomposed" done={activeStep >= 1} /><TraceItem label="Live weather evidence retrieved" done={activeStep >= 1} /><TraceItem label="Environmental state constructed" done={activeStep >= 2} /><TraceItem label="Risk signal inferred" done={activeStep >= 2} active={activeStep === 2} /><TraceItem label="Intervention scenario" done={activeStep >= 3} active={activeStep === 3} /><TraceItem label="Decision recommendation" done={activeStep >= 4} active={activeStep === 4} /></div><button className="text-button">View evidence <ArrowRight size={14} /></button></article>
          </div>

          <div className="metrics">
            <Metric label="Apparent temperature" value={state ? `${state.apparentTemperature.toFixed(1)}°C` : '—'} note="live observation" />
            <Metric label="Heat-risk signal" value={state ? `${state.heatRisk}/100` : '—'} note={state?.riskBand.toLowerCase() ?? 'waiting'} />
            <Metric label="Exposure signal" value={state ? `${state.exposureSignal}%` : '—'} note="prototype spatial proxy" />
            <Metric label="Observation time" value={state ? state.observedAt.slice(11, 16) : '—'} note="Asia/Kolkata" />
          </div>

          <article className="insight-card scenario-card"><div className="card-head"><div><span className="card-kicker">SCENARIO ENGINE</span><h2>What if Delhi intervenes?</h2></div></div><div className="scenario-controls">{(['vegetation', 'cool-roofs', 'shade'] as const).map((item) => <button key={item} className={scenario === item ? 'scenario-active' : ''} onClick={() => setScenario(item)}>{item === 'cool-roofs' ? 'Cool roofs' : item[0].toUpperCase() + item.slice(1)}</button>)}</div><div className="scenario-result">{simulated ? <><strong>{simulated.heatRisk}/100</strong><span>modeled heat-risk signal</span><small>Scenario reduction: {simulated.delta} points. This is a prototype scenario, not a guaranteed forecast.</small></> : <span>Run intelligence to simulate an intervention.</span>}</div></article>
        </section>
      </section>
    </main>
  )
}

function wait(ms: number) { return new Promise((resolve) => window.setTimeout(resolve, ms)) }
function TraceItem({ label, done, active }: { label: string; done?: boolean; active?: boolean }) { return <div className={`trace-item ${done ? 'done' : ''} ${active ? 'active' : ''}`}><span>{done ? '✓' : active ? '◉' : '○'}</span>{label}</div> }
function Metric({ label, value, note }: { label: string; value: string; note: string }) { return <div className="metric"><span>{label}</span><strong>{value}</strong><small>{note}</small></div> }

createRoot(document.getElementById('root')!).render(<App />)
