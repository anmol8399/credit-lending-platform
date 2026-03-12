import { useState, useCallback } from 'react'
import {
  Upload, FileText, AlertTriangle, CheckCircle, ChevronDown, ChevronUp,
  Loader, X, BarChart2, Info, AlertCircle, Zap
} from 'lucide-react'

// Document type configurations — tells Claude what to look for per doc type
const DOC_CONFIGS = {
  gstr3b: {
    label: 'GSTR-3B (Monthly GST Return)',
    color: '#1a3a6b',
    bg: '#e8eef8',
    prompt: `You are a credit analyst AI parsing a GSTR-3B GST return document for a lending decision.

Extract ALL numeric values and return ONLY valid JSON (no markdown, no extra text) in this exact structure:
{
  "summary": "2-3 sentence plain English summary of this document for a credit officer",
  "issues": ["list of concerns or red flags found — e.g. declining turnover, late filing, high tax liability vs ITC"],
  "keyValues": {
    "Total Taxable Turnover": "value in INR or N/A",
    "Total Tax Paid (IGST+CGST+SGST)": "value or N/A",
    "Input Tax Credit (ITC) Claimed": "value or N/A",
    "Net Tax Liability": "value or N/A",
    "Filing Period": "month/year or N/A",
    "GSTIN": "value or N/A",
    "Interest / Late Fee Paid": "value or N/A",
    "Outward Supplies (B2B)": "value or N/A",
    "Outward Supplies (B2C)": "value or N/A",
    "Nil Rated / Exempt Supplies": "value or N/A"
  }
}`
  },
  cibil: {
    label: 'CIBIL / Credit Report',
    color: '#7b3f00',
    bg: '#fef3e0',
    prompt: `You are a credit analyst AI parsing a CIBIL or credit bureau report for a lending decision.

Extract ALL numeric values and return ONLY valid JSON in this exact structure:
{
  "summary": "2-3 sentence plain English summary of creditworthiness for a credit officer",
  "issues": ["list of concerns — e.g. low score, DPD, written-off accounts, high utilization"],
  "keyValues": {
    "CIBIL Score": "numeric score or N/A",
    "Score Date": "date or N/A",
    "Total Accounts": "count or N/A",
    "Active Accounts": "count or N/A",
    "Closed Accounts": "count or N/A",
    "Total Outstanding Balance": "value or N/A",
    "Total Credit Limit": "value or N/A",
    "Credit Utilization %": "percentage or N/A",
    "Days Past Due (DPD)": "value or N/A",
    "Number of Enquiries (6 months)": "count or N/A",
    "Overdue / NPA Accounts": "count or N/A",
    "Written Off Amount": "value or N/A",
    "Oldest Account Age": "years or N/A",
    "Secured Loan Outstanding": "value or N/A",
    "Unsecured Loan Outstanding": "value or N/A"
  }
}`
  },
  bankStatement: {
    label: 'Bank Statement',
    color: '#0f7b5a',
    bg: '#d4f0e8',
    prompt: `You are a credit analyst AI parsing a bank statement for a lending decision.

Extract ALL numeric values and return ONLY valid JSON in this exact structure:
{
  "summary": "2-3 sentence plain English summary of banking behavior and cash flow for a credit officer",
  "issues": ["concerns — e.g. frequent overdrafts, EMI bounces, low average balance, irregular inflows"],
  "keyValues": {
    "Account Holder": "name or N/A",
    "Bank Name": "name or N/A",
    "Account Number (last 4)": "XXXX or N/A",
    "Statement Period": "from-to dates or N/A",
    "Opening Balance": "value or N/A",
    "Closing Balance": "value or N/A",
    "Average Monthly Balance": "value or N/A",
    "Total Credits (period)": "value or N/A",
    "Total Debits (period)": "value or N/A",
    "Number of EMI Transactions": "count or N/A",
    "EMI Bounces / Returns": "count or N/A",
    "Cheque Bounces": "count or N/A",
    "Largest Single Credit": "value or N/A",
    "Largest Single Debit": "value or N/A",
    "Minimum Balance Charges": "value or N/A"
  }
}`
  },
  itr: {
    label: 'Income Tax Return (ITR)',
    color: '#4a1076',
    bg: '#f0e6ff',
    prompt: `You are a credit analyst AI parsing an Income Tax Return (ITR) document for a lending decision.

Extract ALL numeric values and return ONLY valid JSON in this exact structure:
{
  "summary": "2-3 sentence plain English summary of income and tax compliance for a credit officer",
  "issues": ["concerns — e.g. declining net income, high tax demand, mismatch with GST turnover"],
  "keyValues": {
    "Assessment Year": "AY or N/A",
    "PAN": "value or N/A",
    "Name of Taxpayer": "value or N/A",
    "Gross Total Income": "value or N/A",
    "Net Taxable Income": "value or N/A",
    "Business / Profession Income": "value or N/A",
    "Total Tax Payable": "value or N/A",
    "Tax Paid (Advance + TDS)": "value or N/A",
    "Refund / Tax Demand": "value or N/A",
    "Depreciation Claimed": "value or N/A",
    "Net Profit (if available)": "value or N/A",
    "Turnover (as per ITR)": "value or N/A",
    "Filing Date": "date or N/A",
    "Acknowledgement Number": "value or N/A"
  }
}`
  },
  financials: {
    label: 'Audited Financial Statements',
    color: '#8b1a1a',
    bg: '#fde8e6',
    prompt: `You are a credit analyst AI parsing audited financial statements (Balance Sheet + P&L) for a lending decision.

Extract ALL numeric values and return ONLY valid JSON in this exact structure:
{
  "summary": "2-3 sentence plain English summary of financial health and key ratios for a credit officer",
  "issues": ["concerns — e.g. negative net worth, high leverage, declining margins, qualified audit opinion"],
  "keyValues": {
    "Financial Year": "FY or N/A",
    "Revenue from Operations": "value or N/A",
    "Total Income": "value or N/A",
    "EBITDA": "value or N/A",
    "EBITDA Margin %": "percentage or N/A",
    "Net Profit / (Loss)": "value or N/A",
    "Net Profit Margin %": "percentage or N/A",
    "Total Assets": "value or N/A",
    "Net Worth / Equity": "value or N/A",
    "Total Debt": "value or N/A",
    "Debt-to-Equity Ratio": "ratio or N/A",
    "Current Ratio": "ratio or N/A",
    "Cash & Bank Balance": "value or N/A",
    "Trade Receivables (Debtors)": "value or N/A",
    "Trade Payables (Creditors)": "value or N/A",
    "Auditor Opinion": "Unqualified / Qualified / Adverse or N/A"
  }
}`
  },
  gstCert: {
    label: 'GST Registration Certificate',
    color: '#1a3a6b',
    bg: '#e8eef8',
    prompt: `You are a credit analyst AI parsing a GST Registration Certificate.

Extract all values and return ONLY valid JSON in this exact structure:
{
  "summary": "1-2 sentence summary of the registration details",
  "issues": ["any concerns such as cancelled status, recent registration, mismatch with application data"],
  "keyValues": {
    "GSTIN": "value or N/A",
    "Legal Name": "value or N/A",
    "Trade Name": "value or N/A",
    "State": "value or N/A",
    "Registration Date": "date or N/A",
    "Status": "Active / Cancelled or N/A",
    "Business Type": "value or N/A",
    "Principal Place of Business": "address or N/A",
    "Type of Registration": "Regular / Composition / N/A",
    "HSN / SAC Codes": "value or N/A"
  }
}`
  },
}

// Fallback for unknown doc types
const GENERIC_PROMPT = `You are a credit analyst AI parsing a financial document for a lending decision.

Extract all numeric values and text information, return ONLY valid JSON:
{
  "summary": "2-3 sentence plain English summary of this document for a credit officer",
  "issues": ["list any concerns or red flags found"],
  "keyValues": {
    "Document Type": "inferred type or N/A",
    "Key Entity / Name": "value or N/A",
    "Primary Date / Period": "value or N/A",
    "Primary Financial Value 1": "value or N/A",
    "Primary Financial Value 2": "value or N/A",
    "Primary Financial Value 3": "value or N/A",
    "Primary Financial Value 4": "value or N/A",
    "Primary Financial Value 5": "value or N/A"
  }
}`

async function analyzeDocumentWithClaude(file, docType) {
  // Convert file to base64
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const config = DOC_CONFIGS[docType]
  const prompt = config?.prompt || GENERIC_PROMPT
  const isImage = file.type.startsWith('image/')
  const isPDF = file.type === 'application/pdf'

  // Build content array — Claude natively reads PDFs and images
  const content = []

  if (isPDF) {
    content.push({
      type: 'document',
      source: { type: 'base64', media_type: 'application/pdf', data: base64 }
    })
  } else if (isImage) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: file.type, data: base64 }
    })
  } else {
    throw new Error('Unsupported file type. Please upload PDF, JPG, or PNG.')
  }

  content.push({ type: 'text', text: prompt })

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content }],
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const rawText = data.content.map(b => b.text || '').join('')

  // Strip any markdown fences and parse JSON
  const clean = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(clean)
}

// ─── Sub-components (all defined outside to avoid focus/re-render issues) ───

function IssueTag({ text }) {
  const isGood = /good|strong|healthy|excellent|no issue|clean|positive|above/i.test(text)
  const isWarn = /warn|low|below|high util|irregular|moderate/i.test(text)
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px',
      background: isGood ? 'var(--success-light)' : isWarn ? 'var(--warning-light)' : 'var(--danger-light)',
      borderRadius: 8, marginBottom: 6,
    }}>
      {isGood
        ? <CheckCircle size={14} color="var(--success)" style={{ flexShrink: 0, marginTop: 1 }} />
        : isWarn
          ? <AlertCircle size={14} color="var(--warning)" style={{ flexShrink: 0, marginTop: 1 }} />
          : <AlertTriangle size={14} color="var(--danger)" style={{ flexShrink: 0, marginTop: 1 }} />
      }
      <span style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>{text}</span>
    </div>
  )
}

function KVTable({ data }) {
  const entries = Object.entries(data).filter(([, v]) => v && v !== 'N/A' && v !== 'n/a')
  const naEntries = Object.entries(data).filter(([, v]) => !v || v === 'N/A' || v === 'n/a')

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {entries.map(([k, v]) => (
          <div key={k} style={{
            background: 'var(--surface)', borderRadius: 8, padding: '10px 14px',
            border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 10, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{k}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', wordBreak: 'break-word' }}>{v}</div>
          </div>
        ))}
      </div>
      {naEntries.length > 0 && (
        <div style={{ marginTop: 10, fontSize: 11, color: 'var(--slate)' }}>
          Not found in document: {naEntries.map(([k]) => k).join(', ')}
        </div>
      )}
    </div>
  )
}

function DocAnalysisCard({ docKey, file, result, onRemove, onReanalyze, loading }) {
  const [expanded, setExpanded] = useState(true)
  const config = DOC_CONFIGS[docKey] || { label: docKey, color: 'var(--ink)', bg: 'var(--surface)' }
  const issueCount = result?.issues?.filter(i => !/good|excellent|no issue|clean/i.test(i)).length || 0

  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden',
      marginBottom: 16, boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 18px', background: config.bg,
        borderBottom: expanded ? '1px solid var(--border)' : 'none',
        cursor: 'pointer',
      }} onClick={() => setExpanded(e => !e)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: config.color, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={16} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: config.color }}>{config.label}</div>
            <div style={{ fontSize: 11, color: 'var(--slate)' }}>{file.name} · {(file.size / 1024).toFixed(0)} KB</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {result && issueCount > 0 && (
            <span style={{ background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 100, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
              {issueCount} issue{issueCount > 1 ? 's' : ''}
            </span>
          )}
          {result && issueCount === 0 && (
            <span style={{ background: 'var(--success-light)', color: 'var(--success)', borderRadius: 100, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
              ✓ Clean
            </span>
          )}
          {loading && <Loader size={16} color={config.color} style={{ animation: 'spin 1s linear infinite' }} />}
          <button onClick={e => { e.stopPropagation(); onRemove() }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)', padding: 4 }}>
            <X size={15} />
          </button>
          {expanded ? <ChevronUp size={16} color="var(--slate)" /> : <ChevronDown size={16} color="var(--slate)" />}
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div style={{ padding: '18px 18px', background: 'white' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--slate)', fontSize: 14 }}>
                <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Analyzing document with AI...
              </div>
              <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 8 }}>Reading and extracting all values</div>
            </div>
          )}

          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: 24, color: 'var(--slate)', fontSize: 13 }}>
              Ready to analyze. Click "Analyze" to parse this document.
            </div>
          )}

          {!loading && result && (
            <>
              {/* Summary */}
              <div style={{ background: 'var(--accent-light)', borderRadius: 10, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 10 }}>
                <Info size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 13, color: 'var(--accent)', lineHeight: 1.65 }}>{result.summary}</div>
              </div>

              {/* Issues */}
              {result.issues?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-muted)', marginBottom: 10 }}>
                    Findings & Flags
                  </div>
                  {result.issues.map((issue, i) => <IssueTag key={i} text={issue} />)}
                </div>
              )}

              {/* Key-Value pairs */}
              {result.keyValues && Object.keys(result.keyValues).length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-muted)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <BarChart2 size={13} /> Extracted Values
                  </div>
                  <KVTable data={result.keyValues} />
                </div>
              )}

              <button onClick={onReanalyze} style={{
                marginTop: 16, background: 'none', border: '1px solid var(--border)',
                borderRadius: 8, padding: '6px 14px', fontSize: 12, color: 'var(--slate)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Zap size={12} /> Re-analyze
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DocumentParser() {
  const [files, setFiles] = useState({})      // { docKey: File }
  const [results, setResults] = useState({})  // { docKey: parsed JSON }
  const [loading, setLoading] = useState({})  // { docKey: bool }
  const [errors, setErrors] = useState({})    // { docKey: error string }
  const [dragOver, setDragOver] = useState(false)

  const DOC_KEYS = Object.keys(DOC_CONFIGS)

  const handleFile = useCallback((file, docKey) => {
    setFiles(p => ({ ...p, [docKey]: file }))
    setResults(p => { const n = { ...p }; delete n[docKey]; return n })
    setErrors(p => { const n = { ...p }; delete n[docKey]; return n })
  }, [])

  const analyze = useCallback(async (docKey) => {
    const file = files[docKey]
    if (!file) return
    setLoading(p => ({ ...p, [docKey]: true }))
    setErrors(p => { const n = { ...p }; delete n[docKey]; return n })
    try {
      const result = await analyzeDocumentWithClaude(file, docKey)
      setResults(p => ({ ...p, [docKey]: result }))
    } catch (err) {
      setErrors(p => ({ ...p, [docKey]: err.message }))
    } finally {
      setLoading(p => ({ ...p, [docKey]: false }))
    }
  }, [files])

  const analyzeAll = useCallback(async () => {
    for (const key of Object.keys(files)) {
      await analyze(key)
    }
  }, [files, analyze])

  const removeDoc = useCallback((docKey) => {
    setFiles(p => { const n = { ...p }; delete n[docKey]; return n })
    setResults(p => { const n = { ...p }; delete n[docKey]; return n })
    setErrors(p => { const n = { ...p }; delete n[docKey]; return n })
  }, [])

  const uploadedCount = Object.keys(files).length
  const analyzedCount = Object.keys(results).length
  const issueCount = Object.values(results).reduce((s, r) =>
    s + (r?.issues?.filter(i => !/good|excellent|no issue|clean/i.test(i)).length || 0), 0)

  return (
    <div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Stats bar */}
      {uploadedCount > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Documents Uploaded', value: uploadedCount, color: 'var(--accent)', bg: 'var(--accent-light)' },
            { label: 'Analyzed', value: analyzedCount, color: 'var(--success)', bg: 'var(--success-light)' },
            { label: 'Issues Found', value: issueCount, color: issueCount > 0 ? 'var(--danger)' : 'var(--success)', bg: issueCount > 0 ? 'var(--danger-light)' : 'var(--success-light)' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} style={{ background: bg, borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color }}>{value}</div>
              <div style={{ fontSize: 11, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area for each doc type */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {DOC_KEYS.map(key => {
          const config = DOC_CONFIGS[key]
          const file = files[key]
          return (
            <div key={key}>
              {!file ? (
                <div
                  style={{
                    border: `2px dashed ${config.color}40`, borderRadius: 10, padding: '16px',
                    textAlign: 'center', cursor: 'pointer', position: 'relative',
                    background: config.bg + '40', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = config.bg}
                  onMouseLeave={e => e.currentTarget.style.background = config.bg + '40'}
                >
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                    onChange={e => e.target.files[0] && handleFile(e.target.files[0], key)} />
                  <Upload size={16} color={config.color} style={{ marginBottom: 6 }} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: config.color }}>{config.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 2 }}>PDF / JPG / PNG</div>
                </div>
              ) : (
                <div style={{
                  border: `1.5px solid ${config.color}60`, borderRadius: 10, padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: 10, background: config.bg,
                }}>
                  <FileText size={16} color={config.color} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: config.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{config.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--slate)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {!results[key] && !loading[key] && (
                      <button onClick={() => analyze(key)} style={{
                        background: config.color, color: 'white', border: 'none',
                        borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                        <Zap size={11} /> Analyze
                      </button>
                    )}
                    {loading[key] && <Loader size={14} color={config.color} style={{ animation: 'spin 1s linear infinite' }} />}
                    {results[key] && <CheckCircle size={14} color="var(--success)" />}
                    <button onClick={() => removeDoc(key)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)' }}>
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Analyze all button */}
      {uploadedCount > 0 && analyzedCount < uploadedCount && (
        <button onClick={analyzeAll}
          disabled={Object.values(loading).some(Boolean)}
          style={{
            width: '100%', background: 'var(--ink)', color: 'white', border: 'none',
            borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginBottom: 24, opacity: Object.values(loading).some(Boolean) ? 0.6 : 1,
            fontFamily: 'DM Sans, sans-serif',
          }}>
          <Zap size={16} />
          {Object.values(loading).some(Boolean) ? 'Analyzing...' : `Analyze All ${uploadedCount} Document${uploadedCount > 1 ? 's' : ''} with AI`}
        </button>
      )}

      {/* Error display */}
      {Object.entries(errors).map(([key, err]) => (
        <div key={key} style={{
          background: 'var(--danger-light)', border: '1px solid rgba(192,57,43,0.2)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 12,
          display: 'flex', gap: 8, fontSize: 13, color: 'var(--danger)',
        }}>
          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <div><strong>{DOC_CONFIGS[key]?.label || key}:</strong> {err}</div>
        </div>
      ))}

      {/* Results */}
      {Object.entries(results).map(([key, result]) => (
        <DocAnalysisCard
          key={key}
          docKey={key}
          file={files[key]}
          result={result}
          loading={loading[key]}
          onRemove={() => removeDoc(key)}
          onReanalyze={() => analyze(key)}
        />
      ))}

      {uploadedCount === 0 && (
        <div style={{
          textAlign: 'center', padding: '40px 20px',
          border: '2px dashed var(--border)', borderRadius: 14,
          color: 'var(--slate)',
        }}>
          <Upload size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
          <div style={{ fontSize: 14, fontWeight: 500 }}>Upload documents above to begin AI analysis</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Supports PDF, JPG, PNG — GST returns, CIBIL, bank statements, ITR, financials</div>
        </div>
      )}
    </div>
  )
}
