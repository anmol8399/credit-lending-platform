import { useState } from 'react'
import { Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react'

// Master credentials (in production: server-side auth + JWT)
const MASTER_USERNAME = 'credflow_master'
const MASTER_PASSWORD = 'Master@2025'

export default function MasterLogin({ navigate, setIsMaster }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = () => {
    setLoading(true)
    setError('')
    setTimeout(() => {
      if (form.username === MASTER_USERNAME && form.password === MASTER_PASSWORD) {
        setIsMaster(true)
        localStorage.setItem('cf_session', JSON.stringify({ isMaster: true }))
        navigate('master-dashboard')
      } else {
        setError('Invalid master credentials. Access denied.')
      }
      setLoading(false)
    }, 700)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: 24 }}>
        <div className="animate-fade">
          <button onClick={() => navigate('landing')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 40 }}>
            <div style={{
              width: 34, height: 34, background: 'rgba(201,151,43,0.2)', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--gold)', fontSize: 16, fontFamily: 'DM Serif Display, serif',
            }}>C</div>
            <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white' }}>CredFlow</span>
          </button>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 32 }}>
            <div style={{
              width: 44, height: 44, background: 'rgba(201,151,43,0.15)', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <ShieldCheck size={22} color="var(--gold)" />
            </div>
            <div>
              <h2 style={{ color: 'white', fontSize: 24, marginBottom: 4 }}>Master Access</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Credit Officer & Admin Portal</p>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)',
              borderRadius: 10, padding: '12px 16px', marginBottom: 20,
              display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#ff8a7a',
            }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
              Username
            </label>
            <input
              style={{
                width: '100%', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '12px 16px', color: 'white', fontSize: 14,
                outline: 'none', fontFamily: 'DM Sans, sans-serif',
              }}
              type="text" value={form.username} placeholder="master username"
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && login()}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, padding: '12px 44px 12px 16px', color: 'white', fontSize: 14,
                  outline: 'none', fontFamily: 'DM Sans, sans-serif',
                }}
                type={showPass ? 'text' : 'password'} value={form.password} placeholder="••••••••"
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && login()}
              />
              <button onClick={() => setShowPass(p => !p)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
              }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button onClick={login} disabled={loading}
            style={{
              width: '100%', background: 'var(--gold)', color: 'white', border: 'none',
              borderRadius: 10, padding: 14, fontSize: 15, fontWeight: 500, cursor: 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif',
            }}>
            {loading ? 'Authenticating...' : 'Access Master Dashboard'}
          </button>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <button onClick={() => navigate('login')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer' }}>
              ← Customer Login
            </button>
          </div>

          <div style={{ marginTop: 32, padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, fontSize: 12, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
            <strong style={{ color: 'rgba(255,255,255,0.35)' }}>Demo credentials:</strong><br />
            Username: <code style={{ color: 'var(--gold)', opacity: 0.7 }}>credflow_master</code><br />
            Password: <code style={{ color: 'var(--gold)', opacity: 0.7 }}>Master@2025</code>
          </div>
        </div>
      </div>
    </div>
  )
}
