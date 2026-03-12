import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Upload, Send, Loader, FileText, X, ZoomIn, ZoomOut,
  RotateCcw, MessageSquare, BarChart2, Sparkles, ChevronLeft,
  Search, ChevronDown, ChevronRight, User, CheckCircle, AlertTriangle
} from 'lucide-react'

// ─── ALL sub-components outside — prevents focus/remount bugs ─────────────────

function DocTypeLabel({ docKey }) {
  const labels = {
    gstCert: 'GST Certificate', gstr3b: 'GSTR-3B', gstr9: 'GSTR-9 Annual',
    cibil: 'CIBIL Report', bankStatement: 'Bank Statement',
    itr: 'ITR Filing', financials: 'Audited Financials',
    pan: 'PAN Card', incorporation: 'Incorporation Cert', aadhaar: 'Aadhaar',
  }
  return labels[docKey] || docKey
}

function DocIcon({ type }) {
  const isPdf = (type || '').includes('pdf')
  return (
    <div style={{ width: 30, height: 36, background: isPdf ? '#fee2e2' : '#e0f2fe', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <FileText size={14} color={isPdf ? '#dc2626' : '#0284c7'} />
    </div>
  )
}

function CustomerRow({ customer, isOpen, onToggle, selectedDoc, onSelectDoc }) {
  const docs = Object.entries(customer.documents || {})
  const approvedApps = (customer.creditApplications || []).filter(a => a.status === 'approved')

  return (
    <div>
      <button onClick={onToggle} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
        background: isOpen ? 'rgba(26,58,107,0.08)' : 'transparent',
        border: 'none', padding: '10px 14px', cursor: 'pointer',
        textAlign: 'left', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ width: 28, height: 28, background: 'var(--accent-light)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <User size={13} color="var(--accent)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{customer.firmName}</div>
          <div style={{ fontSize: 10, color: 'var(--slate)' }}>{docs.length} doc{docs.length !== 1 ? 's' : ''}{approvedApps.length > 0 ? ' · ✓ Approved' : ''}</div>
        </div>
        {isOpen ? <ChevronDown size={13} color="var(--slate)" /> : <ChevronRight size={13} color="var(--slate)" />}
      </button>

      {isOpen && docs.map(([key, doc]) => {
        const isSelected = selectedDoc?.customerId === customer.id && selectedDoc?.key === key
        return (
          <button key={key} onClick={() => onSelectDoc(customer, key, doc)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            background: isSelected ? 'var(--accent-light)' : 'rgba(0,0,0,0.015)',
            border: 'none', padding: '8px 14px 8px 20px', cursor: 'pointer',
            textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.04)',
            borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent',
            transition: 'all 0.1s',
          }}>
            <DocIcon type={doc.type} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: isSelected ? 700 : 500, color: isSelected ? 'var(--accent)' : 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <DocTypeLabel docKey={key} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--slate)' }}>{doc.name} · {(doc.size / 1024).toFixed(0)} KB</div>
            </div>
          </button>
        )
      })}

      {isOpen && docs.length === 0 && (
        <div style={{ padding: '10px 20px', fontSize: 11, color: 'var(--slate)', fontStyle: 'italic', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>No documents uploaded</div>
      )}
    </div>
  )
}

function UploadZone({ onFile }) {
  const [drag, setDrag] = useState(false)
  return (
    <div
      onDragOver={e => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onFile(f) }}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        border: `2px dashed ${drag ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 12, background: drag ? 'var(--accent-light)' : 'var(--surface)',
        margin: 20, cursor: 'pointer', transition: 'all 0.15s', position: 'relative',
      }}>
      <input type="file" accept=".pdf,.jpg,.jpeg,.png"
        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
        onChange={e => e.target.files[0] && onFile(e.target.files[0])} />
      <div style={{ width: 56, height: 56, background: 'white', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <Upload size={24} color="var(--accent)" />
      </div>
      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)', marginBottom: 6 }}>Drop or click to upload</div>
      <div style={{ fontSize: 12, color: 'var(--slate)', textAlign: 'center', lineHeight: 1.6 }}>
        PDF, JPG, or PNG<br />GST · CIBIL · Bank Statement · ITR
      </div>
    </div>
  )
}

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 14, alignItems: 'flex-start', gap: 8 }}>
      {!isUser && (
        <div style={{ width: 26, height: 26, background: 'var(--ink)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: 10, fontFamily: 'DM Serif Display, serif', flexShrink: 0, marginTop: 2 }}>C</div>
      )}
      <div style={{
        maxWidth: '84%', background: isUser ? 'var(--ink)' : 'white',
        color: isUser ? 'white' : 'var(--ink)',
        borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
        padding: '10px 14px', fontSize: 12.5, lineHeight: 1.7,
        border: isUser ? 'none' : '1px solid var(--border)',
        boxShadow: isUser ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      }}>{msg.content}</div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <div style={{ width: 26, height: 26, background: 'var(--ink)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: 10, fontFamily: 'DM Serif Display, serif', flexShrink: 0 }}>C</div>
      <div style={{ display: 'flex', gap: 4, background: 'white', border: '1px solid var(--border)', borderRadius: '4px 16px 16px 16px', padding: '12px 16px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--slate)', animation: `cfpulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>
    </div>
  )
}

function QuickChip({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid rgba(26,58,107,0.12)',
      borderRadius: 100, padding: '5px 11px', fontSize: 11, cursor: 'pointer',
      fontFamily: 'DM Sans, sans-serif', fontWeight: 500, whiteSpace: 'nowrap',
      transition: 'background 0.1s',
    }}>{label}</button>
  )
}

// ─── Claude API call ──────────────────────────────────────────────────────────
async function callClaude(conversationHistory, docBase64, docMime) {
  const apiMessages = conversationHistory.map((m, i) => {
    if (i === 0 && m.role === 'user' && docBase64) {
      const mediaBlock = docMime === 'application/pdf'
        ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: docBase64 } }
        : { type: 'image', source: { type: 'base64', media_type: docMime, data: docBase64 } }
      return { role: 'user', content: [mediaBlock, { type: 'text', text: m.content }] }
    }
    return { role: m.role, content: m.content }
  })

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: `You are a senior credit analyst at an NBFC reviewing financial documents for lending decisions.
You have deep expertise in: GSTR-3B/9 returns, CIBIL bureau reports, bank statements, ITR filings, audited P&L and balance sheets, GST certificates.

When you analyse a document:
- Start with document type and period covered
- Extract and list every significant financial figure with context
- Identify positive signals and any red flags or inconsistencies
- Give a clear credit-relevant assessment
- Be concise but thorough — use structured formatting with headers where helpful

When answering follow-up questions:
- Reference specific numbers and sections from the document
- Be direct and analytical, not generic
- Flag if something is unclear or missing from the document

Format all currency in Indian format (₹X,XX,XXX). Use crores/lakhs notation for large figures.`,
      messages: apiMessages,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `API ${res.status}`)
  }
  const data = await res.json()
  return data.content.map(b => b.text || '').join('')
}

const ANALYSIS_PROMPT = `Analyse this financial document. Structure your response as:

**Document & Period**
[Type and date range]

**Key Financial Figures**
[Bullet list of every important number]

**Positive Signals**
[Credit strengths]

**Red Flags / Concerns**
[Risks, inconsistencies, issues to investigate]

**Credit Assessment**
[2–3 sentence verdict for the credit file]`

const QUICK_QUESTIONS = [
  'What is the CIBIL score and repayment history?',
  'What is the average monthly bank balance?',
  'Is the GST turnover consistent with ITR income?',
  'Are there any bounced cheques or DPD entries?',
  'What is the net cash flow trend?',
  'Flag any inconsistencies across figures',
  'What is the total outstanding debt?',
  'Is the collateral value adequate for this loan?',
]

// ─── Main component ───────────────────────────────────────────────────────────
export default function PDFViewerPage({ navigate }) {
  const allCustomers = JSON.parse(localStorage.getItem('cf_customers') || '[]')

  const [search, setSearch] = useState('')
  const [openCustomer, setOpenCustomer] = useState(allCustomers[0]?.id || null)
  const [selectedDoc, setSelectedDoc] = useState(null)     // { customerId, key, doc, customer }
  const [docBase64, setDocBase64] = useState(null)
  const [docMime, setDocMime] = useState(null)
  const [objectUrl, setObjectUrl] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [rightTab, setRightTab] = useState('analysis')     // 'analysis' | 'chat'

  const chatEndRef = useRef(null)
  const inputRef   = useRef(null)
  const prevUrlRef = useRef(null)

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const filteredCustomers = allCustomers.filter(c =>
    !search || c.firmName?.toLowerCase().includes(search.toLowerCase()) || c.gstin?.toLowerCase().includes(search.toLowerCase())
  )

  // ── Load a document from customer's saved data ──────────────────────────────
  const loadCustomerDoc = useCallback(async (customer, key, doc) => {
    setSelectedDoc({ customerId: customer.id, key, doc, customer })
    setMessages([])
    setInput('')
    setDocBase64(null)
    setDocMime(null)
    setRightTab('analysis')

    // Revoke previous blob
    if (prevUrlRef.current) { URL.revokeObjectURL(prevUrlRef.current); prevUrlRef.current = null }
    setObjectUrl(null)

    if (!doc.data) {
      // Doc was stored without base64 data (older registrations) — show message
      setMessages([{ role: 'assistant', content: 'This document was uploaded before inline storage was enabled. Re-upload the file using the "Upload File" button below to analyse it.' }])
      return
    }

    // Reconstruct blob from stored base64
    const mime = doc.type || 'application/pdf'
    setDocMime(mime)
    const binary = atob(doc.data)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    const blob = new Blob([bytes], { type: mime })
    const url = URL.createObjectURL(blob)
    prevUrlRef.current = url
    setObjectUrl(url)
    setDocBase64(doc.data)

    // Auto-analyse
    setAiLoading(true)
    try {
      const firstMsg = { role: 'user', content: ANALYSIS_PROMPT }
      const reply = await callClaude([firstMsg], doc.data, mime)
      setMessages([firstMsg, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages([{ role: 'assistant', content: `Could not analyse document: ${e.message}` }])
    } finally {
      setAiLoading(false)
    }
  }, [])

  // ── Load a locally uploaded file ────────────────────────────────────────────
  const loadUploadedFile = useCallback(async (file) => {
    setMessages([])
    setInput('')
    setDocBase64(null)
    setDocMime(null)
    setSelectedDoc({ key: 'upload', doc: { name: file.name, type: file.type, size: file.size }, customer: null, customerId: null })
    setRightTab('analysis')

    if (prevUrlRef.current) { URL.revokeObjectURL(prevUrlRef.current); prevUrlRef.current = null }
    const url = URL.createObjectURL(file)
    prevUrlRef.current = url
    setObjectUrl(url)

    const reader = new FileReader()
    reader.onload = async (e) => {
      const b64 = e.target.result.split(',')[1]
      setDocBase64(b64)
      setDocMime(file.type)

      setAiLoading(true)
      try {
        const firstMsg = { role: 'user', content: ANALYSIS_PROMPT }
        const reply = await callClaude([firstMsg], b64, file.type)
        setMessages([firstMsg, { role: 'assistant', content: reply }])
      } catch (e) {
        setMessages([{ role: 'assistant', content: `Could not analyse document: ${e.message}` }])
      } finally {
        setAiLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }, [])

  // ── Send a chat message ─────────────────────────────────────────────────────
  const send = useCallback(async (text) => {
    const msg = (text || input).trim()
    if (!msg || aiLoading) return
    setInput('')
    const userMsg = { role: 'user', content: msg }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setRightTab('chat')
    setAiLoading(true)
    try {
      const reply = await callClaude(updated, docBase64, docMime)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${e.message}` }])
    } finally {
      setAiLoading(false)
    }
  }, [input, aiLoading, messages, docBase64, docMime])

  const hasDoc = !!(objectUrl || selectedDoc)

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f7fb', fontFamily: 'DM Sans, sans-serif' }}>

      {/* ── Top bar ── */}
      <div style={{ background: 'var(--ink)', height: 54, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14, flexShrink: 0, zIndex: 10 }}>
        <button onClick={() => navigate('master-dashboard')} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '6px 12px', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontFamily: 'DM Sans, sans-serif' }}>
          <ChevronLeft size={13} /> Dashboard
        </button>
        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.12)' }} />
        <Sparkles size={15} color="var(--gold)" />
        <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>Document Review</span>
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>— AI-Powered Analysis</span>
        {selectedDoc && (
          <>
            <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.12)', marginLeft: 8 }} />
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
              {selectedDoc.customer ? selectedDoc.customer.firmName + ' · ' : ''}<span style={{ color: 'var(--gold)' }}><DocTypeLabel docKey={selectedDoc.key} /></span>
            </span>
          </>
        )}
      </div>

      {/* ── Body: three columns ── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '220px 1fr 380px', overflow: 'hidden' }}>

        {/* ══ COL 1: Customer/Doc Sidebar ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', background: 'white', overflow: 'hidden' }}>
          {/* Search */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <Search size={12} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search firms…"
                style={{ width: '100%', paddingLeft: 26, paddingRight: 10, height: 30, border: '1.5px solid var(--border)', borderRadius: 7, fontSize: 12, fontFamily: 'DM Sans, sans-serif', outline: 'none', color: 'var(--ink)', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          {/* Customer list */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {filteredCustomers.length === 0 && (
              <div style={{ padding: 20, fontSize: 12, color: 'var(--slate)', textAlign: 'center', fontStyle: 'italic' }}>No firms found</div>
            )}
            {filteredCustomers.map(c => (
              <CustomerRow
                key={c.id}
                customer={c}
                isOpen={openCustomer === c.id}
                onToggle={() => setOpenCustomer(openCustomer === c.id ? null : c.id)}
                selectedDoc={selectedDoc}
                onSelectDoc={loadCustomerDoc}
              />
            ))}
          </div>

          {/* Upload button */}
          <div style={{ borderTop: '1px solid var(--border)', padding: 10, flexShrink: 0, position: 'relative' }}>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png"
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
              onChange={e => e.target.files[0] && loadUploadedFile(e.target.files[0])} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center', color: 'var(--accent)', fontSize: 12, fontWeight: 600, padding: '6px 0' }}>
              <Upload size={13} /> Upload File
            </div>
          </div>
        </div>

        {/* ══ COL 2: PDF / Image Viewer ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#e8eaf0', borderRight: '1px solid var(--border)', overflow: 'hidden' }}>
          {/* Toolbar */}
          {hasDoc && objectUrl && (
            <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <button onClick={() => setZoom(z => Math.max(0.4, parseFloat((z - 0.15).toFixed(2))))}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5, padding: '4px 7px', cursor: 'pointer' }}>
                <ZoomOut size={13} />
              </button>
              <span style={{ fontSize: 11, color: 'var(--slate)', minWidth: 36, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(3, parseFloat((z + 0.15).toFixed(2))))}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5, padding: '4px 7px', cursor: 'pointer' }}>
                <ZoomIn size={13} />
              </button>
              <button onClick={() => setZoom(1)}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5, padding: '4px 7px', cursor: 'pointer' }}>
                <RotateCcw size={12} />
              </button>
              <div style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--slate)' }}>
                {selectedDoc?.doc?.name} · {selectedDoc?.doc?.size ? `${(selectedDoc.doc.size / 1024).toFixed(0)} KB` : ''}
              </div>
            </div>
          )}

          {/* Viewer area */}
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: hasDoc && objectUrl ? 'flex-start' : 'center', justifyContent: 'center', padding: hasDoc && objectUrl ? 16 : 0 }}>
            {!hasDoc ? (
              <UploadZone onFile={loadUploadedFile} />
            ) : !objectUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: 'var(--slate)', padding: 40 }}>
                <AlertTriangle size={32} color="var(--warning)" />
                <div style={{ fontSize: 13, textAlign: 'center', maxWidth: 260, lineHeight: 1.6 }}>Document data not available in storage. Use the Upload button to load this file manually.</div>
              </div>
            ) : (docMime || '').includes('pdf') ? (
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.12s' }}>
                <iframe src={objectUrl}
                  style={{ width: 680, height: 'calc(100vh - 110px)', border: 'none', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.18)', display: 'block' }}
                  title="Document" />
              </div>
            ) : (
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.12s' }}>
                <img src={objectUrl} alt="Document" style={{ maxWidth: '100%', borderRadius: 6, boxShadow: '0 4px 20px rgba(0,0,0,0.18)' }} />
              </div>
            )}
          </div>
        </div>

        {/* ══ COL 3: AI Analysis + Chat ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#fafbfd', overflow: 'hidden' }}>
          {/* Tab bar */}
          <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 16px', display: 'flex', flexShrink: 0 }}>
            {[
              { id: 'analysis', icon: <BarChart2 size={12} />, label: 'Analysis' },
              { id: 'chat',     icon: <MessageSquare size={12} />, label: 'Ask AI' },
            ].map(t => (
              <button key={t.id} onClick={() => setRightTab(t.id)} style={{
                background: 'none', border: 'none', padding: '11px 14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600,
                color: rightTab === t.id ? 'var(--ink)' : 'var(--slate)',
                borderBottom: rightTab === t.id ? '2px solid var(--ink)' : '2px solid transparent',
                fontFamily: 'DM Sans, sans-serif', transition: 'color 0.1s',
              }}>{t.icon} {t.label}</button>
            ))}
          </div>

          {/* Empty state */}
          {!hasDoc && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32, textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, background: 'var(--surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={22} color="var(--slate)" />
              </div>
              <div style={{ fontWeight: 600, color: 'var(--ink-muted)', fontSize: 14 }}>Select a document</div>
              <div style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.7, maxWidth: 240 }}>Pick a customer file from the left panel — the AI will automatically analyse it and you can ask follow-up questions.</div>
            </div>
          )}

          {/* Loading initial analysis */}
          {hasDoc && aiLoading && messages.length === 0 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
              <Loader size={28} color="var(--accent)" style={{ animation: 'cfspin 1s linear infinite' }} />
              <div style={{ fontSize: 13, color: 'var(--slate)' }}>Analysing document…</div>
            </div>
          )}

          {/* Content */}
          {hasDoc && (aiLoading ? messages.length > 0 : true) && (
            <>
              <div style={{ flex: 1, overflow: 'auto', padding: '16px 16px 8px' }}>

                {/* ── Analysis tab ── */}
                {rightTab === 'analysis' && (
                  <div>
                    {messages.filter(m => m.role === 'assistant').slice(0, 1).map((m, i) => (
                      <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', fontSize: 12.5, lineHeight: 1.8, color: 'var(--ink)', whiteSpace: 'pre-wrap', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                          <div style={{ width: 22, height: 22, background: 'var(--ink)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: 9, fontFamily: 'DM Serif Display, serif' }}>C</div>
                          <span style={{ fontWeight: 700, fontSize: 11, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Credit Analysis</span>
                          {selectedDoc?.customer && <span style={{ fontSize: 10, color: 'var(--slate)' }}>· {selectedDoc.customer.firmName}</span>}
                        </div>
                        {m.content}
                      </div>
                    ))}

                    {messages.length === 0 && !aiLoading && (
                      <div style={{ textAlign: 'center', padding: '20px 0', fontSize: 12, color: 'var(--slate)' }}>
                        No analysis yet. Select a document to begin.
                      </div>
                    )}

                    {/* Quick question chips */}
                    {messages.length > 0 && (
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Quick Questions</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {QUICK_QUESTIONS.map((q, i) => (
                            <QuickChip key={i} label={q} onClick={() => { send(q); setRightTab('chat') }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Chat tab ── */}
                {rightTab === 'chat' && (
                  <div>
                    {messages.length < 2 && (
                      <div style={{ textAlign: 'center', padding: '16px 0 8px', fontSize: 12, color: 'var(--slate)' }}>
                        {hasDoc ? 'Ask anything about this document.' : 'Load a document first.'}
                      </div>
                    )}
                    {/* Skip first 2 messages (initial analysis prompt + response) — show follow-up chat only */}
                    {messages.slice(2).map((m, i) => <ChatMessage key={i} msg={m} />)}
                    {aiLoading && messages.length >= 2 && <TypingIndicator />}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>

              {/* ── Input bar ── */}
              <div style={{ borderTop: '1px solid var(--border)', padding: '10px 14px', background: 'white', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                  <textarea ref={inputRef} value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                    placeholder={hasDoc ? 'Ask about this document… (Enter to send)' : 'Select a document first…'}
                    disabled={!hasDoc || aiLoading}
                    rows={2}
                    style={{
                      flex: 1, resize: 'none', border: '1.5px solid var(--border)', borderRadius: 9,
                      padding: '9px 12px', fontSize: 12.5, fontFamily: 'DM Sans, sans-serif',
                      color: 'var(--ink)', outline: 'none', lineHeight: 1.5, background: hasDoc ? 'white' : 'var(--surface)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <button onClick={() => send()} disabled={!input.trim() || aiLoading || !hasDoc}
                    style={{
                      width: 38, height: 38, background: input.trim() && !aiLoading && hasDoc ? 'var(--ink)' : '#d1d5db',
                      border: 'none', borderRadius: 9, cursor: input.trim() && !aiLoading && hasDoc ? 'pointer' : 'default',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s',
                    }}>
                    {aiLoading ? <Loader size={14} color="white" style={{ animation: 'cfspin 1s linear infinite' }} /> : <Send size={14} color="white" />}
                  </button>
                </div>
                <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 5 }}>Shift+Enter for new line · AI has full document context</div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes cfspin  { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes cfpulse { 0%, 80%, 100% { opacity: 0.2; transform: scale(0.8) } 40% { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  )
}
