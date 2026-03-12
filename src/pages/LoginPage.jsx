import { useState } from 'react'
import { Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'

export default function LoginPage({ navigate, setCurrentUser }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = () => {
    setLoading(true)
    setError('')
    setTimeout(() => {
      const customers = JSON.parse(localStorage.getItem('cf_customers') || '[]')
      const user = customers.find(c => c.username === form.username && c.password === btoa(form.password))
      if (user) {
        const { password, ...safeUser } = user
        setCurrentUser(safeUser)
        localStorage.setItem('cf_session', JSON.stringify({ user: safeUser }))
        navigate('dashboard', safeUser)
      } else {
        setError('Invalid username or password. Please try again.')
      }
      setLoading(false)
    }, 600)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr',
    }}>
      {/* Left — Visual */}
      <div style={{
        background: 'linear-gradient(160deg, var(--ink) 0%, #162447 60%, #0d2137 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: 48,
      }}>
        <button onClick={() => navigate('landing')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', width: 'fit-content' }}>
          <div style={{
            width: 34, height: 34, background: 'rgba(201,151,43,0.2)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--gold)', fontSize: 16, fontFamily: 'DM Serif Display, serif',
          }}>C</div>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white' }}>CredFlow</span>
        </button>

        <div>
          <div style={{ color: 'var(--gold)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
            Welcome Back
          </div>
          <h2 style={{ color: 'white', fontSize: 44, lineHeight: 1.15, marginBottom: 20, letterSpacing: '-0.02em' }}>
            Your credit<br />dashboard awaits.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.7, maxWidth: 360 }}>
            Track applications, manage documents, and monitor your credit limit — all in one place.
          </p>

          {/* Mock dashboard preview */}
          <div style={{ marginTop: 48, background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
            {[
              { label: 'Credit Limit', value: '₹25,00,000', sub: 'Approved', color: 'var(--success)' },
              { label: 'Interest Rate', value: '13.5% p.a.', sub: 'Risk Grade B+', color: 'var(--gold)' },
              { label: 'Next Review', value: '45 days', sub: 'Scheduled', color: 'rgba(255,255,255,0.7)' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0',
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{item.label}</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: item.color, fontSize: 15, fontWeight: 600 }}>{item.value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
          © 2025 CredFlow · Secure · Encrypted · RBI Compliant
        </div>
      </div>

      {/* Right — Form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, background: '#fafbfd' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div className="animate-fade">
            <h2 style={{ fontSize: 32, color: 'var(--ink)', marginBottom: 8 }}>Sign in</h2>
            <p style={{ color: 'var(--slate)', fontSize: 14, marginBottom: 36 }}>
              Access your CredFlow business account.
            </p>

            {error && (
              <div style={{
                background: 'var(--danger-light)', border: '1px solid rgba(192,57,43,0.2)',
                borderRadius: 10, padding: '12px 16px', marginBottom: 20,
                display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--danger)',
              }}>
                <AlertCircle size={15} /> {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" type="text" value={form.username} placeholder="Enter your username"
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && login()} />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" type={showPass ? 'text' : 'password'}
                  value={form.password} placeholder="Enter your password"
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && login()} />
                <button onClick={() => setShowPass(p => !p)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer',
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button onClick={login} disabled={loading} className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 8, fontSize: 15, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : <>Sign In <ArrowRight size={16} /></>}
            </button>

            <div className="divider" />

            <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--slate)' }}>
              New to CredFlow?{' '}
              <button onClick={() => navigate('onboarding')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                Register your business
              </button>
            </div>

            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <button onClick={() => navigate('master-login')} style={{ background: 'none', border: 'none', color: 'var(--slate)', fontSize: 12, cursor: 'pointer' }}>
                Credit Officer / Master Login →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
