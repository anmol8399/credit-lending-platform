import { useState } from 'react'
import { Upload, CheckCircle, AlertCircle, ChevronRight, X, FileText, Eye, EyeOff } from 'lucide-react'

const STEPS = ['Firm Details', 'Proprietor Info', 'Documents', 'Account Setup', 'Review']

function StepIndicator({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
      {STEPS.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: i < current ? 'var(--success)' : i === current ? 'var(--ink)' : 'var(--border)',
              color: i <= current ? 'white' : 'var(--slate)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600, transition: 'all 0.3s ease',
            }}>
              {i < current ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
              color: i <= current ? 'var(--ink)' : 'var(--slate)', whiteSpace: 'nowrap',
            }}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              flex: 1, height: 1, margin: '0 8px', marginBottom: 20,
              background: i < current ? 'var(--success)' : 'var(--border)',
              transition: 'background 0.3s ease',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

function FileUpload({ label, hint, fieldKey, files, setFiles }) {
  const file = files[fieldKey]
  const remove = () => setFiles(p => { const n = { ...p }; delete n[fieldKey]; return n })

  return (
    <div style={{ marginBottom: 16 }}>
      <div className="form-label" style={{ marginBottom: 6 }}>{label}</div>
      {file ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', background: 'var(--success-light)',
          border: '1.5px solid var(--success)', borderRadius: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={16} color="var(--success)" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{file.name}</div>
              <div style={{ fontSize: 11, color: 'var(--slate)' }}>{(file.size / 1024).toFixed(1)} KB</div>
            </div>
          </div>
          <button onClick={remove} style={{ background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="upload-zone">
          <input type="file" accept=".pdf,.jpg,.png,.jpeg"
            onChange={e => e.target.files[0] && setFiles(p => ({ ...p, [fieldKey]: e.target.files[0] }))} />
          <Upload size={20} color="var(--slate)" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 13, color: 'var(--ink-muted)', fontWeight: 500 }}>Click or drag to upload</div>
          <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>{hint}</div>
        </div>
      )}
    </div>
  )
}

export default function OnboardingPage({ navigate }) {
  const [step, setStep] = useState(0)
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [files, setFiles] = useState({})
  const [form, setForm] = useState({
    gstin: '', firmName: '', firmType: '', pan: '', yearEstd: '', turnoverRange: '',
    address: '', city: '', state: '', pincode: '', industry: '',
    propName: '', propPan: '', propAadhaar: '', propMobile: '', propEmail: '', propDob: '',
    directorName2: '', directorPan2: '',
    username: '', password: '', confirmPassword: '',
  })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const validateStep = () => {
    const e = {}
    if (step === 0) {
      if (!form.gstin || form.gstin.length !== 15) e.gstin = 'Valid 15-digit GSTIN required'
      if (!form.firmName) e.firmName = 'Firm name required'
      if (!form.firmType) e.firmType = 'Select firm type'
      if (!form.pan || form.pan.length !== 10) e.pan = 'Valid 10-char PAN required'
    }
    if (step === 1) {
      if (!form.propName) e.propName = 'Proprietor name required'
      if (!form.propMobile || form.propMobile.length !== 10) e.propMobile = 'Valid 10-digit mobile required'
      if (!form.propEmail || !form.propEmail.includes('@')) e.propEmail = 'Valid email required'
    }
    if (step === 3) {
      if (!form.username || form.username.length < 6) e.username = 'Username must be 6+ characters'
      if (!form.password || form.password.length < 8) e.password = 'Password must be 8+ characters'
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validateStep()) return
    setStep(s => s + 1)
  }

  const submit = () => {
    const customers = JSON.parse(localStorage.getItem('cf_customers') || '[]')
    const exists = customers.find(c => c.username === form.username || c.gstin === form.gstin)
    if (exists) { setErrors({ username: 'Username or GSTIN already registered' }); return }

    const newCustomer = {
      id: Date.now().toString(),
      ...form,
      password: btoa(form.password), // basic encoding only for demo
      registeredAt: new Date().toISOString(),
      status: 'active',
      documents: Object.fromEntries(Object.entries(files).map(([k, v]) => [k, { name: v.name, size: v.size, type: v.type }])),
      creditApplications: [],
    }
    customers.push(newCustomer)
    localStorage.setItem('cf_customers', JSON.stringify(customers))
    setSubmitted(true)
  }

  if (submitted) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafbfd' }}>
      <div className="card animate-fade" style={{ maxWidth: 480, width: '90%', textAlign: 'center', padding: 48 }}>
        <div style={{
          width: 72, height: 72, background: 'var(--success-light)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
        }}>
          <CheckCircle size={36} color="var(--success)" />
        </div>
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>Registration Complete!</h2>
        <p style={{ color: 'var(--slate)', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
          Your account has been created successfully. Our team will review your documents within 24 hours. 
          You can now log in and apply for credit.
        </p>
        <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '16px 20px', marginBottom: 28, textAlign: 'left' }}>
          <div style={{ fontSize: 11, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Your Application ID</div>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'var(--ink)' }}>
            CF-{Date.now().toString().slice(-8)}
          </div>
        </div>
        <button onClick={() => navigate('login')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          Sign In to Your Account <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )

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
    <div style={{ minHeight: '100vh', background: '#fafbfd', paddingBottom: 60 }}>
      {/* Header */}
      <div style={{
        background: 'white', borderBottom: '1px solid var(--border)',
        padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <button onClick={() => navigate('landing')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{
            width: 34, height: 34, background: 'var(--ink)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--gold)', fontSize: 16, fontFamily: 'DM Serif Display, serif',
          }}>C</div>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'var(--ink)' }}>CredFlow</span>
        </button>
        <button onClick={() => navigate('login')} style={{ background: 'none', border: 'none', color: 'var(--slate)', fontSize: 13, cursor: 'pointer' }}>
          Already registered? <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign In</span>
        </button>
      </div>

      <div style={{ maxWidth: 720, margin: '48px auto', padding: '0 24px' }}>
        <div className="animate-fade" style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, color: 'var(--ink)', marginBottom: 10 }}>Business Onboarding</h1>
          <p style={{ color: 'var(--slate)', fontSize: 14 }}>Complete your profile to access credit facilities. Takes about 10 minutes.</p>
        </div>

        <StepIndicator current={step} />

        <div className="card animate-fade">
          {/* Step 0 — Firm Details */}
          {step === 0 && <>
            <h3 style={{ fontSize: 20, marginBottom: 6 }}>Firm Information</h3>
            <p style={{ color: 'var(--slate)', fontSize: 13, marginBottom: 24 }}>Basic details about your business entity</p>
            <div className="grid-2">
              <F label="GSTIN *" field="gstin" placeholder="22AAAAA0000A1Z5" hint="15-character GST Identification Number" />
              <F label="Firm / Company Name *" field="firmName" placeholder="ABC Enterprises Pvt Ltd" />
            </div>
            <div className="grid-2">
              <S label="Firm Type *" field="firmType" options={['Sole Proprietorship', 'Partnership', 'LLP', 'Private Limited', 'Public Limited', 'HUF', 'Trust']} />
              <F label="PAN *" field="pan" placeholder="AAAAA0000A" hint="10-character PAN of the entity" />
            </div>
            <div className="grid-2">
              <F label="Year of Establishment" field="yearEstd" type="number" placeholder="2010" />
              <S label="Annual Turnover Range" field="turnoverRange" options={['< ₹50 Lakhs', '₹50L – ₹2Cr', '₹2Cr – ₹10Cr', '₹10Cr – ₹50Cr', '> ₹50Cr']} />
            </div>
            <S label="Industry / Sector" field="industry" options={['Manufacturing', 'Trading', 'Services', 'Agriculture & Allied', 'Construction', 'Hospitality', 'Healthcare', 'Education', 'Logistics', 'Technology', 'Other']} />
            <div className="divider" />
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 16 }}>Registered Address</div>
            <F label="Address" field="address" placeholder="Plot No., Street, Area" />
            <div className="grid-3">
              <F label="City" field="city" placeholder="Mumbai" />
              <S label="State" field="state" options={['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry']} />
              <F label="Pincode" field="pincode" placeholder="400001" />
            </div>
          </>}

          {/* Step 1 — Proprietor */}
          {step === 1 && <>
            <h3 style={{ fontSize: 20, marginBottom: 6 }}>Proprietor / Director Details</h3>
            <p style={{ color: 'var(--slate)', fontSize: 13, marginBottom: 24 }}>Primary contact and identity details</p>
            <div className="grid-2">
              <F label="Full Name *" field="propName" placeholder="As per PAN card" />
              <F label="Date of Birth" field="propDob" type="date" />
            </div>
            <div className="grid-2">
              <F label="PAN *" field="propPan" placeholder="AAAAA0000A" />
              <F label="Aadhaar Number" field="propAadhaar" placeholder="XXXX XXXX XXXX" hint="Last 4 digits will be masked" />
            </div>
            <div className="grid-2">
              <F label="Mobile Number *" field="propMobile" placeholder="9876543210" hint="For OTP and updates" />
              <F label="Email Address *" field="propEmail" type="email" placeholder="name@company.com" />
            </div>
            <div className="divider" />
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 16 }}>
              Additional Director / Partner (if applicable)
            </div>
            <div className="grid-2">
              <F label="Name" field="directorName2" placeholder="Second Director / Partner" />
              <F label="PAN" field="directorPan2" placeholder="AAAAA0000A" />
            </div>
          </>}

          {/* Step 2 — Documents */}
          {step === 2 && <>
            <h3 style={{ fontSize: 20, marginBottom: 6 }}>Document Upload</h3>
            <p style={{ color: 'var(--slate)', fontSize: 13, marginBottom: 24 }}>
              Upload all required documents. Accepted formats: PDF, JPG, PNG (max 10MB each)
            </p>
            <div style={{ background: 'var(--warning-light)', border: '1px solid #f0c56a', borderRadius: 10, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <AlertCircle size={16} color="var(--warning)" style={{ marginTop: 2, flexShrink: 0 }} />
              <div style={{ fontSize: 13, color: 'var(--warning)' }}>
                Documents are encrypted in transit and at rest. Accessible only to our credit team.
              </div>
            </div>
            <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              GST Documents
            </div>
            <FileUpload label="GST Registration Certificate *" hint="PDF or image of GST certificate" fieldKey="gstCert" files={files} setFiles={setFiles} />
            <FileUpload label="GST Returns — Last 12 Months (GSTR-3B) *" hint="Consolidated PDF preferred" fieldKey="gstr3b" files={files} setFiles={setFiles} />
            <FileUpload label="GST Returns — Annual Return (GSTR-9)" hint="Last 2 years" fieldKey="gstr9" files={files} setFiles={setFiles} />
            <div className="divider" />
            <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Credit & Financial Documents
            </div>
            <FileUpload label="CIBIL / Credit Report *" hint="Obtained from CIBIL, Experian, CRIF, or Equifax" fieldKey="cibil" files={files} setFiles={setFiles} />
            <FileUpload label="Bank Statement — Last 12 Months *" hint="PDF from bank portal preferred" fieldKey="bankStatement" files={files} setFiles={setFiles} />
            <FileUpload label="ITR — Last 2 Years" hint="Acknowledgement copy with computation" fieldKey="itr" files={files} setFiles={setFiles} />
            <FileUpload label="Audited Financial Statements" hint="Balance sheet + P&L for last 2 years" fieldKey="financials" files={files} setFiles={setFiles} />
            <div className="divider" />
            <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Identity & Business Proof
            </div>
            <FileUpload label="PAN Card (Entity) *" hint="Clear scan or photo" fieldKey="panCard" files={files} setFiles={setFiles} />
            <FileUpload label="Certificate of Incorporation / Partnership Deed" hint="Registration certificate from MCA or Registrar" fieldKey="incorp" files={files} setFiles={setFiles} />
            <FileUpload label="Proprietor Aadhaar Card" hint="Both sides" fieldKey="aadhaar" files={files} setFiles={setFiles} />
          </>}

          {/* Step 3 — Account Setup */}
          {step === 3 && <>
            <h3 style={{ fontSize: 20, marginBottom: 6 }}>Create Your Login</h3>
            <p style={{ color: 'var(--slate)', fontSize: 13, marginBottom: 24 }}>Set up your credentials to access the CredFlow portal</p>
            <F label="Username *" field="username" placeholder="min. 6 characters" hint="You'll use this to log in" />
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" type={showPass ? 'text' : 'password'}
                  value={form.password} placeholder="min. 8 characters"
                  onChange={e => set('password', e.target.value)} />
                <button onClick={() => setShowPass(p => !p)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer',
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <div style={{ fontSize: 11, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertCircle size={12} /> {errors.password}
              </div>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input className="form-input" type="password"
                value={form.confirmPassword} placeholder="Re-enter password"
                onChange={e => set('confirmPassword', e.target.value)} />
              {errors.confirmPassword && <div style={{ fontSize: 11, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertCircle size={12} /> {errors.confirmPassword}
              </div>}
            </div>
            <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 16, marginTop: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password requirements</div>
              {[
                ['8+ characters', form.password.length >= 8],
                ['One uppercase letter', /[A-Z]/.test(form.password)],
                ['One number', /[0-9]/.test(form.password)],
              ].map(([label, ok]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: ok ? 'var(--success-light)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {ok && <CheckCircle size={10} color="var(--success)" />}
                  </div>
                  <span style={{ fontSize: 12, color: ok ? 'var(--success)' : 'var(--slate)' }}>{label}</span>
                </div>
              ))}
            </div>
          </>}

          {/* Step 4 — Review */}
          {step === 4 && <>
            <h3 style={{ fontSize: 20, marginBottom: 6 }}>Review & Submit</h3>
            <p style={{ color: 'var(--slate)', fontSize: 13, marginBottom: 24 }}>Confirm your details before submitting</p>
            {[
              { section: 'Firm Details', rows: [['GSTIN', form.gstin], ['Firm Name', form.firmName], ['Type', form.firmType], ['PAN', form.pan], ['City / State', `${form.city}, ${form.state}`], ['Industry', form.industry], ['Turnover', form.turnoverRange]] },
              { section: 'Proprietor', rows: [['Name', form.propName], ['PAN', form.propPan], ['Mobile', form.propMobile], ['Email', form.propEmail]] },
              { section: 'Documents', rows: Object.entries(files).map(([k, v]) => [k, v.name]) },
            ].map(({ section, rows }) => (
              <div key={section} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                  {section}
                </div>
                {rows.filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
                    <span style={{ color: 'var(--slate)' }}>{k}</span>
                    <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{v}</span>
                  </div>
                ))}
              </div>
            ))}
            <div style={{ background: 'var(--accent-light)', border: '1px solid rgba(26,58,107,0.2)', borderRadius: 10, padding: 16, fontSize: 13, color: 'var(--accent)', lineHeight: 1.6 }}>
              By submitting, you confirm that all information provided is accurate and authorize CredFlow to verify your GST and credit details as part of the credit assessment process.
            </div>
          </>}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate('landing')}
              className="btn-outline">
              {step === 0 ? 'Cancel' : '← Back'}
            </button>
            {step < 4
              ? <button onClick={next} className="btn-primary">
                  Continue <ChevronRight size={16} />
                </button>
              : <button onClick={submit} className="btn-gold" style={{ padding: '12px 32px' }}>
                  Submit Application ✓
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
