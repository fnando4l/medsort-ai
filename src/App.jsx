import { useState, useCallback, useRef } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  Upload, FileText, X, CheckCircle, Clock, AlertCircle,
  Eye, EyeOff, ChevronDown, ChevronUp, Activity,
  Building2, Tag, LayoutDashboard, Inbox
} from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'Lab Results', 'Radiology Report', 'Prescription', 'Referral Letter',
  'Insurance Claim', 'Discharge Summary', 'Progress Notes',
  'Pathology Report', 'Consent Form', 'Other'
]

const DEPARTMENT_ROUTING = {
  'Lab Results': 'Laboratory',
  'Radiology Report': 'Radiology',
  'Prescription': 'Pharmacy',
  'Referral Letter': 'Referral Coordination',
  'Insurance Claim': 'Billing & Insurance',
  'Discharge Summary': 'Medical Records',
  'Progress Notes': 'Medical Records',
  'Pathology Report': 'Pathology',
  'Consent Form': 'Patient Services',
  'Other': 'General Administration',
}

const CATEGORY_COLORS = {
  'Lab Results': '#3b82f6',
  'Radiology Report': '#8b5cf6',
  'Prescription': '#10b981',
  'Referral Letter': '#f59e0b',
  'Insurance Claim': '#ef4444',
  'Discharge Summary': '#06b6d4',
  'Progress Notes': '#84cc16',
  'Pathology Report': '#f97316',
  'Consent Form': '#ec4899',
  'Other': '#6b7280',
}

const CATEGORY_BG = {
  'Lab Results': 'bg-blue-100 text-blue-800',
  'Radiology Report': 'bg-purple-100 text-purple-800',
  'Prescription': 'bg-emerald-100 text-emerald-800',
  'Referral Letter': 'bg-amber-100 text-amber-800',
  'Insurance Claim': 'bg-red-100 text-red-800',
  'Discharge Summary': 'bg-cyan-100 text-cyan-800',
  'Progress Notes': 'bg-lime-100 text-lime-800',
  'Pathology Report': 'bg-orange-100 text-orange-800',
  'Consent Form': 'bg-pink-100 text-pink-800',
  'Other': 'bg-slate-100 text-slate-700',
}

// ─── Sample Documents ─────────────────────────────────────────────────────────

const SAMPLE_DOCS = [
  {
    name: 'CBC Lab Results',
    text: `LABORATORY REPORT
Patient: John Smith  |  DOB: 03/15/1968  |  MRN: LAB-2024-7823
Date: March 12, 2026  |  Ordering Physician: Dr. Maria Chen, MD

COMPLETE BLOOD COUNT (CBC)

Test               Result      Reference Range    Flag
WBC                7.2 K/uL    4.0–11.0 K/uL
RBC                4.8 M/uL    4.2–5.4 M/uL
Hemoglobin         14.2 g/dL   12.0–16.0 g/dL
Hematocrit         42.1%       37.0–47.0%
MCV                87.7 fL     80.0–100.0 fL
MCH                29.6 pg     27.0–33.0 pg
MCHC               33.7 g/dL   32.0–36.0 g/dL
Platelets          245 K/uL    150–400 K/uL
Neutrophils        58%         50–70%
Lymphocytes        32%         20–40%

IMPRESSION: CBC within normal limits.
Reviewed by: Dr. Sarah Johnson, MD, Pathology`,
  },
  {
    name: 'Chest X-Ray Report',
    text: `DIAGNOSTIC RADIOLOGY REPORT
Facility: Metro General Hospital
Patient: Emily Rodriguez  |  DOB: 07/22/1975  |  MRN: RAD-2024-3341
Exam Date: March 12, 2026  |  Exam: CHEST X-RAY PA AND LATERAL

CLINICAL INDICATION: Persistent cough, rule out pneumonia

TECHNIQUE: PA and lateral views of the chest were obtained.

FINDINGS:
Lungs: Clear bilaterally. No consolidation, effusion, or pneumothorax.
Heart: Cardiac silhouette within normal limits. CTR ~0.45.
Mediastinum: Not widened. Aortic knob unremarkable.
Bones: No acute bony abnormality.

IMPRESSION: No acute cardiopulmonary process identified.

Interpreting Radiologist: Dr. James Park, MD, Radiology`,
  },
  {
    name: 'Metformin Prescription',
    text: `PRESCRIPTION
Healthcare Provider: Riverside Medical Associates
Dr. Thomas Williams, MD  |  License #: MD-48291  |  DEA #: BW4829103
Date: March 12, 2026

Patient: Robert Chen  |  DOB: 11/30/1955
Address: 4521 Oak Street, Springfield, IL 62701

Rx: Metformin HCl
Strength: 500 mg  |  Form: Extended-Release Tablets  |  Qty: #90
Sig: Take one tablet by mouth twice daily with meals
Refills: 5

Diagnosis: Type 2 Diabetes Mellitus (E11.9)
WARNINGS: Take with food. Monitor blood glucose regularly.

Signature: Dr. Thomas Williams, MD  |  NPI: 1234567890`,
  },
  {
    name: 'Cardiology Referral Letter',
    text: `REFERRAL LETTER
Date: March 12, 2026

TO: Dr. Patricia Nguyen, MD — Cardiologist, Heart Care Specialists
FROM: Dr. Michael Torres, MD — Springfield Family Medicine

RE: Margaret Johnson, DOB: 04/08/1948, MRN: PCP-2024-5512

Dear Dr. Nguyen,

I am referring Margaret Johnson, a 77-year-old female with hypertension and hyperlipidemia, for cardiology evaluation.

REASON FOR REFERRAL: Progressive exertional dyspnea over 3 months. New LBBB on EKG. BNP elevated at 480 pg/mL.

CURRENT MEDICATIONS: Lisinopril 10mg, Atorvastatin 40mg, Aspirin 81mg

VITALS: BP 148/88, HR 78, SpO2 96% on room air

Please evaluate for cardiac etiology and guide further management.

Dr. Michael Torres, MD  |  Phone: (217) 555-0201`,
  },
  {
    name: 'Post-Op Discharge Summary',
    text: `DISCHARGE SUMMARY
Patient: David Williams  |  DOB: 09/12/1961  |  MRN: HOSP-2024-9982
Admission: March 9, 2026  |  Discharge: March 12, 2026
Attending: Dr. Sarah Kim, MD, Surgery

ADMITTING DIAGNOSIS: Acute appendicitis
DISCHARGE DIAGNOSIS: Acute appendicitis, uncomplicated, post-laparoscopic appendectomy

HOSPITAL COURSE:
64-year-old male presented with 24-hour RLQ pain, nausea, and low-grade fever. CT confirmed acute appendicitis without perforation. Underwent successful laparoscopic appendectomy on March 9. Post-op course unremarkable.

PROCEDURES: Laparoscopic appendectomy; IV antibiotics (Cefazolin)

DISCHARGE MEDICATIONS:
- Ibuprofen 600mg q6h PRN
- Acetaminophen 500mg q6h PRN

FOLLOW-UP: Dr. Sarah Kim — March 19, 2026
Return to ED if fever >101°F, increasing pain, or wound concerns.

Dr. Sarah Kim, MD — Signed March 12, 2026`,
  },
]

// ─── API Call ─────────────────────────────────────────────────────────────────

let _id = 1
function genId() { return _id++ }

async function classifyDoc(text, apiKey) {
  const res = await fetch('/.netlify/functions/classify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, apiKey }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
  return data
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatBox({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

function ConfidenceBar({ value }) {
  const color = value >= 90 ? 'bg-emerald-500' : value >= 75 ? 'bg-blue-500' : 'bg-amber-500'
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full confidence-bar ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-600 w-8 text-right">{value}%</span>
    </div>
  )
}

function QueueItem({ item }) {
  const icons = {
    processing: (
      <svg className="spinner w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
    ),
    done: <CheckCircle size={16} className="text-emerald-500" />,
    error: <AlertCircle size={16} className="text-red-500" />,
  }
  return (
    <div className="flex items-center gap-2 py-2 border-b border-slate-100 last:border-0">
      {icons[item.status]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 truncate">{item.name}</p>
        {item.status === 'error' && (
          <p className="text-xs text-red-500 truncate">{item.error}</p>
        )}
      </div>
      <span className="text-xs text-slate-400 capitalize">{item.status}</span>
    </div>
  )
}

function ResultCard({ result }) {
  const [expanded, setExpanded] = useState(false)
  const badgeCls = CATEGORY_BG[result.category] || 'bg-slate-100 text-slate-700'
  const dot = CATEGORY_COLORS[result.category] || '#6b7280'

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden result-card-enter">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 truncate text-sm">{result.name}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeCls}`}>
                {result.category}
              </span>
              <span className="text-xs text-slate-400">
                {result.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <button
            onClick={() => setExpanded(e => !e)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Confidence</span>
          </div>
          <ConfidenceBar value={result.confidence} />
        </div>

        <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
          <Building2 size={12} className="text-blue-500 flex-shrink-0" />
          <span className="font-medium">Route to:</span>
          <span className="text-blue-700 font-semibold">{result.department}</span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50 p-4 space-y-3">
          {result.summary && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Summary</p>
              <p className="text-sm text-slate-700 leading-relaxed">{result.summary}</p>
            </div>
          )}
          {result.keyInfo?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Key Information</p>
              <ul className="space-y-1">
                {result.keyInfo.map((info, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-sm text-slate-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot }} />
                    {info}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function StatsPanel({ results }) {
  const categories = results.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1
    return acc
  }, {})

  const pieData = Object.entries(categories).map(([name, value]) => ({ name, value }))
  const uniqueTypes = Object.keys(categories).length
  const avgConf = results.length
    ? Math.round(results.reduce((s, r) => s + r.confidence, 0) / results.length)
    : 0

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <LayoutDashboard size={16} className="text-blue-600" />
        <h2 className="font-semibold text-slate-800">Dashboard</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatBox label="Classified" value={results.length} color="text-blue-600" />
        <StatBox label="Avg Confidence" value={results.length ? `${avgConf}%` : '—'} color="text-emerald-600" />
        <StatBox label="Doc Types" value={uniqueTypes || '—'} color="text-purple-600" />
        <StatBox label="Departments" value={uniqueTypes ? new Set(results.map(r => r.department)).size : '—'} color="text-amber-600" />
      </div>

      {pieData.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] || '#6b7280'}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value, name]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {pieData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-slate-300">
          <Activity size={32} className="mb-2" />
          <p className="text-sm">No data yet</p>
        </div>
      )}
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [inputText, setInputText] = useState('')
  const [inputName, setInputName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [showPaste, setShowPaste] = useState(false)
  const [showSamples, setShowSamples] = useState(false)
  const [queue, setQueue] = useState([])
  const [results, setResults] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')

  const fileRef = useRef(null)

  const processDocument = useCallback(async (name, text) => {
    if (!apiKey.trim()) {
      alert('Please enter your API key first.')
      return
    }
    if (!text.trim()) {
      alert('Document text is empty.')
      return
    }
    const id = genId()
    setQueue(prev => [...prev, { id, name, status: 'processing' }])
    try {
      const result = await classifyDoc(text, apiKey)
      setResults(prev => [{
        id, name, ...result,
        timestamp: new Date(),
      }, ...prev])
      setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'done' } : q))
      setTimeout(() => setQueue(prev => prev.filter(q => q.id !== id)), 2500)
    } catch (err) {
      setQueue(prev => prev.map(q => q.id === id
        ? { ...q, status: 'error', error: err.message }
        : q
      ))
    }
  }, [apiKey])

  const handleFile = useCallback((file) => {
    if (!file || !file.name.endsWith('.txt')) {
      alert('Please upload a .txt file.')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      setInputText(e.target.result)
      setInputName(file.name.replace('.txt', ''))
      setShowPaste(true)
    }
    reader.readAsText(file)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)

  const handleClassify = () => {
    if (!inputText.trim()) return
    const name = inputName.trim() || `Document ${genId()}`
    processDocument(name, inputText)
    setInputText('')
    setInputName('')
    setShowPaste(false)
  }

  const presentCategories = [...new Set(results.map(r => r.category))]
  const filters = ['All', ...presentCategories]
  const filtered = activeFilter === 'All'
    ? results
    : results.filter(r => r.category === activeFilter)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
                <path d="M14 8h4v6h6v4h-6v6h-4v-6H8v-4h6z" fill="white"/>
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-none">MedSort AI</h1>
              <p className="text-xs text-slate-500">Medical Document Classifier</p>
            </div>
          </div>

          {/* API Key */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500 whitespace-nowrap">API Key</label>
            <div className="relative flex items-center">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 pr-8 w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
              />
              <button
                onClick={() => setShowKey(k => !k)}
                className="absolute right-2 text-slate-400 hover:text-slate-600"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {apiKey && (
              <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" title="Key entered" />
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-5">
          {/* Upload Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Upload size={16} className="text-blue-600" />
              <h2 className="font-semibold text-slate-800">Upload Document</h2>
            </div>

            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'drop-zone-active border-blue-400 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <FileText size={28} className={`mx-auto mb-2 ${isDragging ? 'text-blue-500' : 'text-slate-300'}`} />
              <p className="text-sm font-medium text-slate-600">Drop .txt file here</p>
              <p className="text-xs text-slate-400 mt-0.5">or click to browse</p>
              <input
                ref={fileRef}
                type="file"
                accept=".txt"
                className="hidden"
                onChange={e => handleFile(e.target.files[0])}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setShowPaste(p => !p)}
                className="flex-1 text-sm py-2 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium"
              >
                Paste Text
              </button>
              <div className="relative flex-1">
                <button
                  onClick={() => setShowSamples(s => !s)}
                  className="w-full text-sm py-2 px-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-medium flex items-center justify-center gap-1"
                >
                  Samples
                  <ChevronDown size={14} className={`transition-transform ${showSamples ? 'rotate-180' : ''}`} />
                </button>
                {showSamples && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    {SAMPLE_DOCS.map((doc) => (
                      <button
                        key={doc.name}
                        onClick={() => {
                          setInputText(doc.text)
                          setInputName(doc.name)
                          setShowPaste(true)
                          setShowSamples(false)
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                      >
                        {doc.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Paste Area */}
            {showPaste && (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  value={inputName}
                  onChange={e => setInputName(e.target.value)}
                  placeholder="Document name (optional)"
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Paste document text here..."
                  rows={8}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleClassify}
                    disabled={!inputText.trim()}
                    className="flex-1 py-2 px-4 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Classify Document
                  </button>
                  <button
                    onClick={() => { setInputText(''); setInputName(''); setShowPaste(false) }}
                    className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Processing Queue */}
          {queue.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Inbox size={16} className="text-slate-500" />
                <h2 className="font-semibold text-slate-800">Processing Queue</h2>
                <span className="ml-auto text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                  {queue.length}
                </span>
              </div>
              <div>
                {queue.map(item => <QueueItem key={item.id} item={item} />)}
              </div>
            </div>
          )}

          {/* Stats Panel */}
          <StatsPanel results={results} />
        </div>

        {/* Right Column — Results */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-slate-500" />
              <h2 className="font-semibold text-slate-800">
                Results
                {results.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-slate-400">({results.length})</span>
                )}
              </h2>
            </div>
            {results.length > 0 && (
              <button
                onClick={() => { setResults([]); setActiveFilter('All') }}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Filters */}
          {filters.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                    activeFilter === f
                      ? 'bg-blue-700 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-700'
                  }`}
                >
                  {f}
                  {f !== 'All' && (
                    <span className={`ml-1 ${activeFilter === f ? 'opacity-70' : 'text-slate-400'}`}>
                      {results.filter(r => r.category === f).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Result cards */}
          {filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map(result => <ResultCard key={result.id} result={result} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
              <FileText size={48} className="mb-3" />
              <p className="text-base font-medium text-slate-400">No documents classified yet</p>
              <p className="text-sm text-slate-300 mt-1">
                Upload a .txt file, paste text, or load a sample document
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
