import { useState } from 'react'
import { ChevronRight, CheckCircle, AlertCircle, Info } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'

// Simple ML scoring simulation (ready to be replaced with real ML/RAG pipeline)
function computeCreditDecision(form, user) {
  // Placeholder scoring logic — replace with actual ML model calls
  const turnoverScores = {
    '< ₹50 Lakhs': 40, '₹50L – ₹2Cr': 55, '₹2Cr – ₹10Cr': 68,
    '₹10Cr – ₹50Cr': 80, '> ₹50Cr': 90,
  }
  const baseScore = turnoverScores[user.turnoverRange] || 50

  const requested = Number(form.requestedAmount)
  const affordable = requested <= 500000 ? 1 : requested <= 2000000 ? 0.85 : requested <= 5000000 ? 0.7 : 0.5
  const score = Math.round(baseScore * affordable + Math.random() * 10)

  let riskGrade, interestRate, riskPremium, approvedRatio
  if (score >= 80) { riskGrade = 'A+'; interestRate = 11.5; riskPremium = 1.5; approvedRatio = 1.0 }
  else if (score >= 70) { riskGrade = 'A'; interestRate = 12.5; riskPremium = 2.5; approvedRatio = 0.9 }
  else if (score >= 60) { riskGrade = 'B+'; interestRate = 13.5; riskPremium = 3.5; approvedRatio = 0.8 }
  else if (score >= 50) { riskGrade = 'B'; interestRate = 15.0; riskPremium = 5.0; approvedRatio = 0.7 }
  else if (score >= 40) { riskGrade = 'C'; interestRate = 18.0; riskPremium = 8.0; approvedRatio = 0.5 }
  else { riskGrade = 'D'; interestRate = null; riskPremium = null; approvedRatio = 0 }

  return {
    score,
    riskGrade,
    interestRate,
    riskPremium,
    approvedAmount: approvedRatio > 0 ? Math.round(requested * approvedRatio) : null,
    status: approvedRatio > 0 ? 'approved' : 'rejected',
  }
}

export default function CreditApplicationPage({ user, navigate }) {
  const [step, setStep] = useState(0) // 0=form, 1=review, 2=decision
  const [form, setForm] = useState({
    requestedAmount: '', facilityType: '', purpose: '', tenure: '',
    collateral: '', collateralValue: '', existingDebt: '', monthlyRevenue: '',
    businessModel: '', repaymentSource: '', additionalInfo: '',
  })
  const [decision, setDecision] = useState(null)
  const [errors, setErrors] = useState({})

  if (!user) { navigate('login'); return null }
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.requestedAmount || isNaN(form.requestedAmount) || Number(form.requestedAmount) < 100000)
      e.requestedAmount = 'Minimum credit request is ₹1,00,000'
    if (!form.facilityType) e.facilityType = 'Select a credit facility type'
    if (!form.purpose) e.purpose = 'Specify the purpose of credit'
    if (!form.tenure) e.tenure = 'Select tenure'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submitApplication = () => {
    const result = computeCreditDecision(form, user)
    setDecision(result)

    const allCustomers = JSON.parse(localStorage.getItem('cf_customers') || '[]')
    const idx = allCustomers.findIndex(c => c.id === user.id)
    if (idx !== -1) {
      const app = {
        ...form,
        ...result,
        submittedAt: new Date().toISOString(),
        applicationId: `CF-APP-${Date.now().toString().slice(-8)}`,
      }
      allCustomers[idx].creditApplications = [...(allCustomers[idx].creditApplications || []), app]
      localStorage.setItem('cf_customers', JSON.stringify(allCustomers))
    }
    setStep(2)
  }

  const F = ({ label, field, type = 'text', placeholder = '', hint = '' }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" type={type} value={form[field]} placeholder={placeholder}
        onChange={e => set(field, e.target.value)} />
      {errors[field] && <div style={{ fontSize: 11, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 4 }}>
        <AlertCircle size={12} /> {errors[field]}
      </div>}
      {hint && !errors[field] && <div style={{ fontSize: 11, color: 'var(--slate)' }}>{hint}</div>}
    </div>
  )

  const S = ({ label, field, options }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select className="form-select" value={form[field]} onChange={e => set(field, e.target.value)}>
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {errors[field] && <div style={{ fontSize: 11, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 4 }}>
        <AlertCircle size={12} /> {errors[field]}
      </div>}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#fafbfd' }}>
      <Navbar user={user} navigate={navigate} showBack backPage="dashboard" backLabel="Dashboard" />

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px' }}>
        <div className="animate-fade" style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 34, color: 'var(--ink)', marginBottom: 8 }}>Credit Application</h1>
          <p style={{ color: 'var(--slate)', fontSize: 14 }}>
            {user.firmName} · {user.gstin}
          </p>
        </div>

        {/* Step 0 — Application Form */}
        {step === 0 && (
          <div className="animate-fade">
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, marginBottom: 6 }}>Credit Requirement</h3>
              <p style={{ color: 'var(--slate)', fontSize: 13, marginBottom: 24 }}>Tell us about the credit you need</p>

              <div className="grid-2">
                <F label="Credit Amount Requested (₹) *" field="requestedAmount" type="number" placeholder="500000" hint="Enter amount in Rupees" />
                <S label="Credit Facility Type *" field="facilityType" options={['Working Capital Loan', 'Term Loan', 'Cash Credit / OD', 'Invoice Discounting', 'Letter of Credit', 'Bank Guarantee', 'Supply Chain Finance', 'Equipment Finance']} />
              </div>
              <div className="grid-2">
                <S label="Purpose of Credit *" field="purpose" options={['Purchase of Raw Material', 'Inventory Build-up', 'Purchase of Equipment', 'Business Expansion', 'Import / Export Finance', 'Salary & Operations', 'Working Capital Gap', 'Capex', 'Debt Refinancing', 'Other']} />
                <S label="Preferred Tenure *" field="tenure" options={['3 Months', '6 Months', '12 Months', '18 Months', '24 Months', '36 Months', '48 Months', '60 Months']} />
              </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, marginBottom: 6 }}>Financial Profile</h3>
              <p style={{ color: 'var(--slate)', fontSize: 13, marginBottom: 24 }}>Help us assess your repayment capacity</p>
              <div className="grid-2">
                <F label="Average Monthly Revenue (₹)" field="monthlyRevenue" type="number" placeholder="500000" />
                <F label="Existing Total Debt (₹)" field="existingDebt" type="number" placeholder="0" hint="Outstanding loans / credit facilities" />
              </div>
              <div className="grid-2">
                <S label="Collateral Available" field="collateral" options={['None', 'Property / Real Estate', 'Fixed Deposits', 'Machinery / Equipment', 'Stocks / Shares', 'Receivables / Debtors', 'Gold', 'Vehicle']} />
                <F label="Collateral Value (₹)" field="collateralValue" type="number" placeholder="0" hint="Estimated market value" />
              </div>
            </div>

            <div className="card" style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, marginBottom: 6 }}>Business Narrative</h3>
              <p style={{ color: 'var(--slate)', fontSize: 13, marginBottom: 24 }}>Help our ML engine better understand your business</p>
              <div className="form-group">
                <label className="form-label">Business Model / Operations</label>
                <textarea className="form-input" rows={3} value={form.businessModel}
                  placeholder="Describe your business — who you sell to, what you manufacture/trade/provide..."
                  onChange={e => set('businessModel', e.target.value)}
                  style={{ resize: 'vertical', fontFamily: 'DM Sans, sans-serif' }} />
                <div style={{ fontSize: 11, color: 'var(--slate)' }}>This text is processed by our NLP pipeline for better credit assessment</div>
              </div>
              <div className="form-group">
                <label className="form-label">Primary Repayment Source</label>
                <textarea className="form-input" rows={2} value={form.repaymentSource}
                  placeholder="Expected cash flows, seasonal cycles, buyer payment terms..."
                  onChange={e => set('repaymentSource', e.target.value)}
                  style={{ resize: 'vertical', fontFamily: 'DM Sans, sans-serif' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Any Additional Information</label>
                <textarea className="form-input" rows={2} value={form.additionalInfo}
                  placeholder="Orders in hand, upcoming contracts, growth plans..."
                  onChange={e => set('additionalInfo', e.target.value)}
                  style={{ resize: 'vertical', fontFamily: 'DM Sans, sans-serif' }} />
              </div>
            </div>

            <div style={{ background: 'var(--accent-light)', border: '1px solid rgba(26,58,107,0.15)', borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', gap: 10 }}>
              <Info size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: 13, color: 'var(--accent)', lineHeight: 1.6 }}>
                Our AI system will analyze your uploaded documents (GST returns, CIBIL, bank statements) along with this application 
                to determine your credit limit, risk premium, and interest rate. Decisions are typically communicated within 4–8 hours.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => navigate('dashboard')} className="btn-outline">← Cancel</button>
              <button onClick={() => validate() && setStep(1)} className="btn-primary">
                Review Application <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 1 — Review */}
        {step === 1 && (
          <div className="animate-fade">
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, marginBottom: 20 }}>Application Summary</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  ['Requested Amount', `₹${Number(form.requestedAmount).toLocaleString('en-IN')}`],
                  ['Facility Type', form.facilityType],
                  ['Tenure', form.tenure],
                  ['Purpose', form.purpose],
                  ['Monthly Revenue', form.monthlyRevenue ? `₹${Number(form.monthlyRevenue).toLocaleString('en-IN')}` : 'Not provided'],
                  ['Existing Debt', form.existingDebt ? `₹${Number(form.existingDebt).toLocaleString('en-IN')}` : '₹0'],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: 'var(--surface)', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: 10, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{v}</div>
                  </div>
                ))}
              </div>

              {form.businessModel && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <div style={{ fontSize: 11, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Business Narrative</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.6 }}>{form.businessModel}</div>
                </div>
              )}
            </div>

            <div style={{ background: 'var(--warning-light)', border: '1px solid #f0c56a', borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: 'var(--warning)', lineHeight: 1.6 }}>
                By submitting, you authorize CredFlow to access your registered documents and conduct a credit assessment. 
                This will be reflected on your credit profile.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setStep(0)} className="btn-outline">← Edit</button>
              <button onClick={submitApplication} className="btn-gold" style={{ padding: '12px 32px' }}>
                Submit Application ✓
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Decision */}
        {step === 2 && decision && (
          <div className="animate-fade">
            <div className="card" style={{ textAlign: 'center', padding: 48, marginBottom: 20 }}>
              <div style={{
                width: 80, height: 80,
                background: decision.status === 'approved' ? 'var(--success-light)' : 'var(--danger-light)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                {decision.status === 'approved'
                  ? <CheckCircle size={40} color="var(--success)" />
                  : <AlertCircle size={40} color="var(--danger)" />}
              </div>
              <div style={{ fontSize: 12, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                Credit Decision
              </div>
              <h2 style={{ fontSize: 36, color: decision.status === 'approved' ? 'var(--success)' : 'var(--danger)', marginBottom: 16 }}>
                {decision.status === 'approved' ? 'Application Approved' : 'Application Declined'}
              </h2>

              {decision.status === 'approved' ? (
                <>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 48, color: 'var(--ink)', marginBottom: 4 }}>
                    ₹{Number(decision.approvedAmount).toLocaleString('en-IN')}
                  </div>
                  <div style={{ color: 'var(--slate)', fontSize: 14, marginBottom: 36 }}>Approved Credit Limit</div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 500, margin: '0 auto 32px' }}>
                    {[
                      ['Risk Grade', decision.riskGrade, 'var(--gold-dark)', 'var(--gold-light)'],
                      ['Interest Rate', `${decision.interestRate}% p.a.`, 'var(--accent)', 'var(--accent-light)'],
                      ['Risk Premium', `+${decision.riskPremium}%`, 'var(--ink-muted)', 'var(--surface)'],
                    ].map(([label, value, color, bg]) => (
                      <div key={label} style={{ background: bg, borderRadius: 12, padding: '16px 12px' }}>
                        <div style={{ fontSize: 10, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
                        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: 'var(--surface)', borderRadius: 12, padding: '14px 20px', maxWidth: 480, margin: '0 auto', fontSize: 13, color: 'var(--slate)', lineHeight: 1.6 }}>
                    Our ML engine assessed your financial profile and assigned a <strong style={{ color: 'var(--ink)' }}>Risk Grade {decision.riskGrade}</strong>. 
                    A credit officer will contact you within 24 hours to complete disbursement formalities.
                  </div>
                </>
              ) : (
                <div style={{ maxWidth: 440, margin: '0 auto', color: 'var(--slate)', fontSize: 14, lineHeight: 1.7 }}>
                  Based on the current financial profile and credit assessment, we are unable to approve this application. 
                  You may re-apply after 90 days or contact your credit officer for further guidance.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => navigate('dashboard')} className="btn-primary">
                Return to Dashboard
              </button>
              {decision.status === 'rejected' && (
                <button onClick={() => { setStep(0); setDecision(null) }} className="btn-outline">
                  Modify & Reapply
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
