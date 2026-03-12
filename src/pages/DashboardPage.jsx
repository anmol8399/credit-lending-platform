import { useState } from 'react'
import { FileText, CreditCard, CheckCircle, Clock, AlertCircle, ChevronRight, Bell, TrendingUp, Shield, Download } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'

function StatCard({ label, value, sub, icon, color = 'var(--accent)', bg = 'var(--accent-light)' }) {
  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: -20, right: -20, width: 80, height: 80,
        background: bg, borderRadius: '50%', opacity: 0.5,
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, background: bg, color, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
      </div>
      <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: 'var(--ink)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 600, marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

export default function DashboardPage({ user, navigate, logout }) {
  const [activeTab, setActiveTab] = useState('overview')
  if (!user) { navigate('login'); return null }

  const allCustomers = JSON.parse(localStorage.getItem('cf_customers') || '[]')
  const customerData = allCustomers.find(c => c.id === user.id) || user

  const applications = customerData.creditApplications || []
  const latestApp = applications[applications.length - 1]

  const docs = customerData.documents || {}
  const docCount = Object.keys(docs).length

  const tabs = ['overview', 'documents', 'applications', 'profile']

  return (
    <div style={{ minHeight: '100vh', background: '#fafbfd' }}>
      <Navbar user={user} onLogout={logout} navigate={navigate} />

      {/* Welcome bar */}
      <div style={{ background: 'var(--ink)', padding: '24px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
              Good day, {user.propName?.split(' ')[0] || 'there'}
            </div>
            <h2 style={{ color: 'white', fontSize: 24, letterSpacing: '-0.01em' }}>{user.firmName}</h2>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => navigate('credit-application')} className="btn-gold" style={{ fontSize: 13 }}>
              Apply for Credit <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 0 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              background: 'none', border: 'none', padding: '16px 20px',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              color: activeTab === t ? 'var(--ink)' : 'var(--slate)',
              borderBottom: activeTab === t ? '2px solid var(--ink)' : '2px solid transparent',
              textTransform: 'capitalize', letterSpacing: '0.02em',
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 40px' }}>
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="animate-fade">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
              <StatCard label="Credit Limit" value={latestApp?.approvedAmount || '—'} sub={latestApp ? 'Approved' : 'Apply for credit'} icon={<CreditCard size={18} />} />
              <StatCard label="Risk Grade" value={latestApp?.riskGrade || '—'} sub={latestApp?.interestRate ? `${latestApp.interestRate}% p.a.` : 'Pending assessment'} icon={<Shield size={18} />} color="var(--gold-dark)" bg="var(--gold-light)" />
              <StatCard label="Documents" value={`${docCount}/10`} sub="Uploaded" icon={<FileText size={18} />} color="var(--success)" bg="var(--success-light)" />
              <StatCard label="Applications" value={applications.length} sub={applications.length > 0 ? 'Submitted' : 'None yet'} icon={<TrendingUp size={18} />} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
              {/* Application status */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 18 }}>Credit Applications</h3>
                  <button onClick={() => navigate('credit-application')} className="btn-primary" style={{ fontSize: 12, padding: '8px 16px' }}>
                    New Application
                  </button>
                </div>
                {applications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <CreditCard size={36} color="var(--border)" style={{ marginBottom: 12 }} />
                    <div style={{ color: 'var(--slate)', fontSize: 13 }}>No credit applications yet.</div>
                    <button onClick={() => navigate('credit-application')} style={{ marginTop: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                      Apply for your first credit →
                    </button>
                  </div>
                ) : applications.map((app, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 0', borderBottom: i < applications.length - 1 ? '1px solid var(--border-soft)' : 'none',
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>
                        ₹{Number(app.requestedAmount).toLocaleString('en-IN')} Credit Request
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--slate)' }}>
                        {new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {app.purpose}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {app.approvedAmount && <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: 'var(--success)' }}>₹{Number(app.approvedAmount).toLocaleString('en-IN')}</span>}
                      <span className={`badge badge-${app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="card">
                  <h4 style={{ fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Bell size={16} /> Notifications
                  </h4>
                  {[
                    { msg: 'Welcome to CredFlow! Complete your profile.', time: 'Just now', type: 'info' },
                    docCount < 5 && { msg: 'Upload remaining documents for faster approval.', time: '1d ago', type: 'warning' },
                  ].filter(Boolean).map((n, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-soft)' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: n.type === 'info' ? 'var(--accent)' : 'var(--warning)', marginTop: 5, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.5 }}>{n.msg}</div>
                        <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <h4 style={{ fontSize: 15, marginBottom: 16 }}>Account Status</h4>
                  {[
                    ['GSTIN', user.gstin, true],
                    ['Documents', `${docCount} uploaded`, docCount >= 3],
                    ['Credit Score', latestApp ? 'Assessed' : 'Pending', !!latestApp],
                  ].map(([k, v, ok]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-soft)' }}>
                      <span style={{ fontSize: 12, color: 'var(--slate)' }}>{k}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>{v}</span>
                        {ok ? <CheckCircle size={12} color="var(--success)" /> : <Clock size={12} color="var(--warning)" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 24, marginBottom: 4 }}>Your Documents</h2>
                <p style={{ color: 'var(--slate)', fontSize: 13 }}>{docCount} documents uploaded to secure vault</p>
              </div>
              <button onClick={() => navigate('onboarding')} className="btn-outline" style={{ fontSize: 13 }}>
                Upload More
              </button>
            </div>
            <div className="card">
              {Object.keys(docs).length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <FileText size={40} color="var(--border)" style={{ marginBottom: 12 }} />
                  <div style={{ color: 'var(--slate)' }}>No documents uploaded yet.</div>
                </div>
              ) : Object.entries(docs).map(([key, doc], i) => (
                <div key={key} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 0', borderBottom: i < Object.keys(docs).length - 1 ? '1px solid var(--border-soft)' : 'none',
                }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 36, height: 36, background: 'var(--accent-light)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={16} color="var(--accent)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{doc.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--slate)' }}>{key} · {(doc.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className="badge badge-success"><CheckCircle size={9} /> Uploaded</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 24 }}>Credit Applications</h2>
              <button onClick={() => navigate('credit-application')} className="btn-primary">
                New Application <ChevronRight size={14} />
              </button>
            </div>
            {applications.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: 60 }}>
                <CreditCard size={48} color="var(--border)" style={{ marginBottom: 16 }} />
                <h3 style={{ color: 'var(--ink-muted)', marginBottom: 8 }}>No applications yet</h3>
                <p style={{ color: 'var(--slate)', fontSize: 13, marginBottom: 24 }}>Apply for your first credit facility</p>
                <button onClick={() => navigate('credit-application')} className="btn-primary">Apply for Credit</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {applications.map((app, i) => (
                  <div key={i} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                          Application #{applications.length - i} · {new Date(app.submittedAt).toLocaleDateString('en-IN')}
                        </div>
                        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: 'var(--ink)', marginBottom: 8 }}>
                          ₹{Number(app.requestedAmount).toLocaleString('en-IN')}
                        </div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--slate)' }}>
                          <span>Purpose: <strong style={{ color: 'var(--ink)' }}>{app.purpose}</strong></span>
                          <span>Tenure: <strong style={{ color: 'var(--ink)' }}>{app.tenure}</strong></span>
                          <span>Type: <strong style={{ color: 'var(--ink)' }}>{app.facilityType}</strong></span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className={`badge badge-${app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}`} style={{ marginBottom: 8, display: 'inline-flex' }}>
                          {app.status === 'approved' ? <CheckCircle size={10} /> : app.status === 'rejected' ? <AlertCircle size={10} /> : <Clock size={10} />}
                          {app.status}
                        </span>
                        {app.approvedAmount && (
                          <div>
                            <div style={{ fontSize: 11, color: 'var(--slate)' }}>Approved</div>
                            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'var(--success)' }}>
                              ₹{Number(app.approvedAmount).toLocaleString('en-IN')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {app.approvedAmount && (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 24 }}>
                        <div><div style={{ fontSize: 11, color: 'var(--slate)' }}>Risk Grade</div><div style={{ fontWeight: 600, color: 'var(--gold-dark)' }}>{app.riskGrade}</div></div>
                        <div><div style={{ fontSize: 11, color: 'var(--slate)' }}>Interest Rate</div><div style={{ fontWeight: 600 }}>{app.interestRate}% p.a.</div></div>
                        <div><div style={{ fontSize: 11, color: 'var(--slate)' }}>Risk Premium</div><div style={{ fontWeight: 600 }}>{app.riskPremium}%</div></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="animate-fade">
            <h2 style={{ fontSize: 24, marginBottom: 24 }}>Business Profile</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div className="card">
                <h4 style={{ fontSize: 16, marginBottom: 20 }}>Firm Details</h4>
                {[
                  ['GSTIN', user.gstin], ['Firm Name', user.firmName], ['Firm Type', user.firmType],
                  ['PAN', user.pan], ['Industry', user.industry], ['Turnover', user.turnoverRange],
                  ['Established', user.yearEstd], ['City', `${user.city}, ${user.state}`],
                ].map(([k, v]) => v ? (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-soft)', fontSize: 13 }}>
                    <span style={{ color: 'var(--slate)' }}>{k}</span>
                    <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{v}</span>
                  </div>
                ) : null)}
              </div>
              <div className="card">
                <h4 style={{ fontSize: 16, marginBottom: 20 }}>Proprietor Details</h4>
                {[
                  ['Name', user.propName], ['PAN', user.propPan], ['Mobile', user.propMobile],
                  ['Email', user.propEmail], ['DOB', user.propDob],
                ].map(([k, v]) => v ? (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-soft)', fontSize: 13 }}>
                    <span style={{ color: 'var(--slate)' }}>{k}</span>
                    <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{v}</span>
                  </div>
                ) : null)}
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 4 }}>Registered</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{new Date(user.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
