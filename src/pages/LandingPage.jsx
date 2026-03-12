import { ArrowRight, Shield, Zap, BarChart3, FileText, Lock, ChevronRight, Star } from 'lucide-react'

export default function LandingPage({ navigate }) {
  return (
    <div style={{ minHeight: '100vh', background: '#fafbfd' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(250,251,253,0.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 48px', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: 'var(--ink)', borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--gold)', fontSize: 18, fontFamily: 'DM Serif Display, serif',
          }}>C</div>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            CredFlow
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('master-login')} className="btn-outline" style={{ fontSize: 13, padding: '9px 18px' }}>
            Master Login
          </button>
          <button onClick={() => navigate('login')} className="btn-outline" style={{ fontSize: 13, padding: '9px 18px' }}>
            Sign In
          </button>
          <button onClick={() => navigate('onboarding')} className="btn-primary" style={{ fontSize: 13, padding: '9px 18px' }}>
            Apply Now <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '96px 48px 80px',
        maxWidth: 1180, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center',
      }}>
        <div className="animate-fade">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--gold-light)', color: 'var(--gold-dark)',
            padding: '6px 14px', borderRadius: 100,
            fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
            marginBottom: 24,
          }}>
            <Star size={11} fill="currentColor" /> AI-Powered Credit Decisions
          </div>
          <h1 style={{ fontSize: 56, lineHeight: 1.08, color: 'var(--ink)', marginBottom: 24, letterSpacing: '-0.03em' }}>
            Credit That<br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Understands</em><br />
            Your Business
          </h1>
          <p style={{ fontSize: 17, color: 'var(--ink-muted)', lineHeight: 1.7, maxWidth: 460, marginBottom: 36 }}>
            Intelligent working capital solutions for Indian businesses. 
            Submit your GST & CIBIL documents once — our ML engine handles the rest, 
            giving you decisions in hours, not weeks.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => navigate('onboarding')} className="btn-gold" style={{ fontSize: 15, padding: '14px 32px' }}>
              Get Started Free <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('login')} className="btn-outline" style={{ fontSize: 15, padding: '14px 24px' }}>
              Existing Customer
            </button>
          </div>
          <div style={{ marginTop: 40, display: 'flex', gap: 32 }}>
            {[['₹500Cr+', 'Disbursed'], ['2,400+', 'Businesses'], ['4.8hrs', 'Avg Decision']].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'var(--ink)' }}>{num}</div>
                <div style={{ fontSize: 12, color: 'var(--slate)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual card stack */}
        <div className="animate-fade-delay" style={{ position: 'relative', height: 440 }}>
          {/* Background cards */}
          <div style={{
            position: 'absolute', top: 32, right: 16, width: 320, height: 200,
            background: 'var(--ink-soft)', borderRadius: 20,
            transform: 'rotate(4deg)',
          }} />
          <div style={{
            position: 'absolute', top: 20, right: 8, width: 320, height: 200,
            background: 'var(--ink-muted)', borderRadius: 20,
            transform: 'rotate(2deg)',
          }} />
          {/* Main card */}
          <div style={{
            position: 'absolute', top: 8, right: 0, width: 320, height: 200,
            background: 'linear-gradient(135deg, var(--ink) 0%, #162447 100%)',
            borderRadius: 20, padding: 28,
            boxShadow: '0 24px 60px rgba(10,15,30,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
              <span style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--gold)', fontSize: 18 }}>CredFlow</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(201,151,43,0.4)' }} />
                ))}
              </div>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: '0.1em', marginBottom: 8 }}>CREDIT LIMIT</div>
            <div style={{ color: 'white', fontSize: 28, fontFamily: 'DM Serif Display, serif', marginBottom: 20 }}>₹45,00,000</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.08em' }}>FIRM</div>
                <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500 }}>Sharma Exports Pvt Ltd</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.08em' }}>RISK GRADE</div>
                <div style={{ color: 'var(--gold)', fontSize: 18, fontFamily: 'DM Serif Display, serif' }}>A+</div>
              </div>
            </div>
          </div>

          {/* Stats cards below */}
          <div style={{
            position: 'absolute', bottom: 60, left: 0, width: 200,
            background: 'white', borderRadius: 16, padding: 20,
            boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 11, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Decision Time
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: 'var(--ink)' }}>4.2</span>
              <span style={{ color: 'var(--slate)', fontSize: 14 }}>hours</span>
            </div>
            <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginTop: 12 }}>
              <div style={{ height: '100%', width: '72%', background: 'var(--gold)', borderRadius: 2 }} />
            </div>
          </div>

          <div style={{
            position: 'absolute', bottom: 40, right: 0, width: 180,
            background: 'white', borderRadius: 16, padding: 20,
            boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 11, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Approval Rate
            </div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: 'var(--success)' }}>78%</div>
            <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>↑ 12% vs last yr</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'var(--ink)', padding: '80px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ color: 'var(--gold)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
            Simple Process
          </div>
          <h2 style={{ color: 'white', fontSize: 40, marginBottom: 56, letterSpacing: '-0.02em' }}>
            From Application to Approval
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {[
              { n: '01', title: 'Register', desc: 'Submit your firm details, GSTIN, and proprietor information.' },
              { n: '02', title: 'Upload Docs', desc: 'Securely upload your GST returns, CIBIL, bank statements.' },
              { n: '03', title: 'ML Analysis', desc: 'Our AI parses and scores your financials automatically.' },
              { n: '04', title: 'Get Credit', desc: 'Receive your limit, rate, and tenure decision instantly.' },
            ].map((step, i) => (
              <div key={i} style={{
                padding: '28px 20px',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                position: 'relative',
              }}>
                <div style={{
                  fontFamily: 'DM Serif Display, serif', fontSize: 48,
                  color: 'rgba(201,151,43,0.2)', lineHeight: 1, marginBottom: 16,
                }}>{step.n}</div>
                <div style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{step.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 38, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 12 }}>
            Built for Indian SMEs
          </h2>
          <p style={{ color: 'var(--slate)', fontSize: 15 }}>
            Fully integrated with GST & CIBIL ecosystems for smart, data-driven lending.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { icon: <Shield size={22} />, title: 'Secure Document Vault', desc: 'Bank-grade encryption for all uploaded documents. SOC2 compliant infrastructure with zero data sharing.' },
            { icon: <Zap size={22} />, title: 'AI-Powered Decisions', desc: 'NLP parsing of GST returns and financial statements. ML models trained on thousands of SME profiles.' },
            { icon: <BarChart3 size={22} />, title: 'Dynamic Credit Scoring', desc: 'Real-time risk grading from A+ to D with dynamic interest rates based on your financial profile.' },
            { icon: <FileText size={22} />, title: 'GST & CIBIL Native', desc: 'Direct integration-ready with GSTN APIs. Auto-verification of provided GSTIN details.' },
            { icon: <Lock size={22} />, title: 'Regulatory Compliant', desc: 'Designed to meet RBI NBFC guidelines and digital lending norms for India.' },
            { icon: <ChevronRight size={22} />, title: 'Instant Notifications', desc: 'SMS and email alerts at every stage. Credit officers notified in real-time on new applications.' },
          ].map((f, i) => (
            <div key={i} className="card" style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}>
              <div style={{
                width: 44, height: 44, background: 'var(--accent-light)', color: 'var(--accent)',
                borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
              }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)', marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--slate)', lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 48px 80px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--ink) 0%, #162447 100%)',
          borderRadius: 24, padding: '56px 64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: 'var(--shadow-xl)',
        }}>
          <div>
            <h2 style={{ color: 'white', fontSize: 34, marginBottom: 12, letterSpacing: '-0.02em' }}>
              Ready to unlock working capital?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>
              Register your firm in under 10 minutes.
            </p>
          </div>
          <button onClick={() => navigate('onboarding')} className="btn-gold" style={{ fontSize: 15, padding: '16px 36px', whiteSpace: 'nowrap' }}>
            Start Application <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '28px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, background: 'var(--ink)', borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--gold)', fontSize: 14, fontFamily: 'DM Serif Display, serif',
          }}>C</div>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: 'var(--ink-muted)' }}>CredFlow</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--slate)' }}>
          © 2025 CredFlow. NBFC Regulated. CIN: U65999MH2024PTC000000
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Support'].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: 'var(--slate)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
