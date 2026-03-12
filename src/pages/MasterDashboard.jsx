import { useState, useMemo } from 'react'
import { Search, Users, FileText, CreditCard, TrendingUp, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronRight, Download, X, Filter } from 'lucide-react'

function Stat({ label, value, icon, color = 'var(--accent)', bg = 'var(--accent-light)' }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ width: 38, height: 38, background: bg, color, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
      </div>
      <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 30, color: 'var(--ink)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
    </div>
  )
}

function CustomerModal({ customer, onClose }) {
  const [tab, setTab] = useState('info')
  if (!customer) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(10,15,30,0.6)', backdropFilter: 'blur(4px)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'white', borderRadius: 20, width: '100%', maxWidth: 760,
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-xl)',
      }}>
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Customer Profile</div>
            <h3 style={{ fontSize: 22, color: 'var(--ink)', marginBottom: 4 }}>{customer.firmName}</h3>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--slate)' }}>
              <span>{customer.gstin}</span>
              <span>·</span>
              <span>{customer.firmType}</span>
              <span>·</span>
              <span>{customer.city}, {customer.state}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '0 28px', borderBottom: '1px solid var(--border)' }}>
          {['info', 'documents', 'applications'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: 'none', border: 'none', padding: '12px 16px', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, textTransform: 'capitalize', letterSpacing: '0.02em',
              color: tab === t ? 'var(--ink)' : 'var(--slate)',
              borderBottom: tab === t ? '2px solid var(--ink)' : '2px solid transparent',
            }}>{t}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ overflow: 'auto', padding: 28, flex: 1 }}>
          {tab === 'info' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Firm Details</div>
                {[
                  ['GSTIN', customer.gstin], ['PAN', customer.pan], ['Type', customer.firmType],
                  ['Industry', customer.industry], ['Turnover', customer.turnoverRange],
                  ['Est. Year', customer.yearEstd], ['Address', customer.address],
                  ['City', customer.city], ['State', customer.state], ['PIN', customer.pincode],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-soft)', fontSize: 13 }}>
                    <span style={{ color: 'var(--slate)' }}>{k}</span>
                    <span style={{ fontWeight: 500, color: 'var(--ink)', maxWidth: 220, textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Proprietor</div>
                {[
                  ['Name', customer.propName], ['PAN', customer.propPan],
                  ['Aadhaar', customer.propAadhaar ? `XXXX XXXX ${customer.propAadhaar.slice(-4)}` : '—'],
                  ['Mobile', customer.propMobile], ['Email', customer.propEmail],
                  ['DOB', customer.propDob],
                ].filter(([, v]) => v && v !== '—').map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-soft)', fontSize: 13 }}>
                    <span style={{ color: 'var(--slate)' }}>{k}</span>
                    <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Account</div>
                  {[
                    ['Username', customer.username],
                    ['Registered', new Date(customer.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
                    ['Status', customer.status],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-soft)', fontSize: 13 }}>
                      <span style={{ color: 'var(--slate)' }}>{k}</span>
                      <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'documents' && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
                Uploaded Documents ({Object.keys(customer.documents || {}).length})
              </div>
              {Object.keys(customer.documents || {}).length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--slate)' }}>No documents uploaded</div>
              ) : Object.entries(customer.documents || {}).map(([key, doc]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-soft)' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 36, height: 36, background: 'var(--accent-light)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={16} color="var(--accent)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{doc.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--slate)' }}>{key} · {(doc.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                  <span className="badge badge-success"><CheckCircle size={9} /> Uploaded</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'applications' && (
            <div>
              {(customer.creditApplications || []).length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--slate)' }}>No credit applications submitted</div>
              ) : (customer.creditApplications || []).map((app, i) => (
                <div key={i} style={{ background: 'var(--surface)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 4 }}>{app.applicationId} · {new Date(app.submittedAt).toLocaleDateString('en-IN')}</div>
                      <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'var(--ink)' }}>
                        ₹{Number(app.requestedAmount).toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 2 }}>{app.facilityType} · {app.purpose} · {app.tenure}</div>
                    </div>
                    <span className={`badge badge-${app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}`}>
                      {app.status}
                    </span>
                  </div>
                  {app.approvedAmount && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                      {[
                        ['Approved', `₹${Number(app.approvedAmount).toLocaleString('en-IN')}`],
                        ['Risk Grade', app.riskGrade],
                        ['Interest Rate', `${app.interestRate}%`],
                        ['Risk Premium', `+${app.riskPremium}%`],
                      ].map(([k, v]) => (
                        <div key={k} style={{ background: 'white', borderRadius: 8, padding: '10px 12px' }}>
                          <div style={{ fontSize: 10, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {app.businessModel && (
                    <div style={{ marginTop: 14, padding: '12px 14px', background: 'white', borderRadius: 8, borderLeft: '3px solid var(--accent)' }}>
                      <div style={{ fontSize: 10, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Business Narrative (NLP Input)</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6 }}>{app.businessModel}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MasterDashboard({ navigate, logout }) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [activeTab, setActiveTab] = useState('customers')

  const allCustomers = JSON.parse(localStorage.getItem('cf_customers') || '[]')

  const stats = useMemo(() => {
    const apps = allCustomers.flatMap(c => c.creditApplications || [])
    const approved = apps.filter(a => a.status === 'approved')
    const totalApproved = approved.reduce((s, a) => s + Number(a.approvedAmount || 0), 0)
    return {
      customers: allCustomers.length,
      applications: apps.length,
      approved: approved.length,
      totalCreditDeployed: totalApproved,
    }
  }, [allCustomers])

  const filtered = useMemo(() => {
    return allCustomers.filter(c => {
      const matchSearch = !search ||
        c.firmName?.toLowerCase().includes(search.toLowerCase()) ||
        c.gstin?.toLowerCase().includes(search.toLowerCase()) ||
        c.propName?.toLowerCase().includes(search.toLowerCase())
      const apps = c.creditApplications || []
      const matchStatus = filterStatus === 'all' ||
        (filterStatus === 'applied' && apps.length > 0) ||
        (filterStatus === 'no-app' && apps.length === 0) ||
        (filterStatus === 'approved' && apps.some(a => a.status === 'approved'))
      return matchSearch && matchStatus
    })
  }, [allCustomers, search, filterStatus])

  const allApps = useMemo(() => {
    return allCustomers.flatMap(c =>
      (c.creditApplications || []).map(a => ({ ...a, firmName: c.firmName, gstin: c.gstin }))
    ).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
  }, [allCustomers])

  return (
    <div style={{ minHeight: '100vh', background: '#fafbfd' }}>
      {selectedCustomer && <CustomerModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />}

      {/* Topbar */}
      <div style={{
        background: 'var(--ink)', padding: '0 36px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, background: 'rgba(201,151,43,0.2)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--gold)', fontSize: 15, fontFamily: 'DM Serif Display, serif',
          }}>C</div>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: 'white' }}>CredFlow</span>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.15)', margin: '0 8px' }} />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Master Dashboard</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Credit Officer Portal</span>
          <button onClick={logout} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '7px 14px',
            fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          }}>Sign Out</button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '20px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 1200 }}>
          <Stat label="Registered Firms" value={stats.customers} icon={<Users size={17} />} />
          <Stat label="Total Applications" value={stats.applications} icon={<FileText size={17} />} />
          <Stat label="Approved" value={stats.approved} icon={<CheckCircle size={17} />} color="var(--success)" bg="var(--success-light)" />
          <Stat label="Credit Deployed" value={stats.totalCreditDeployed > 0 ? `₹${(stats.totalCreditDeployed / 100000).toFixed(1)}L` : '₹0'} icon={<TrendingUp size={17} />} color="var(--gold-dark)" bg="var(--gold-light)" />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 36px' }}>
        {['customers', 'applications'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            background: 'none', border: 'none', padding: '14px 18px', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, textTransform: 'capitalize',
            color: activeTab === t ? 'var(--ink)' : 'var(--slate)',
            borderBottom: activeTab === t ? '2px solid var(--ink)' : '2px solid transparent',
          }}>{t}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: '28px auto', padding: '0 36px' }}>
        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="animate-fade">
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate)' }} />
                <input className="form-input" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by firm name, GSTIN, or proprietor..."
                  style={{ paddingLeft: 36, maxWidth: 480 }} />
              </div>
              <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 180 }}>
                <option value="all">All Firms</option>
                <option value="applied">Has Applications</option>
                <option value="no-app">No Applications</option>
                <option value="approved">Approved Credit</option>
              </select>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                  <Users size={40} color="var(--border)" style={{ marginBottom: 12 }} />
                  <div style={{ color: 'var(--slate)', fontSize: 14 }}>
                    {allCustomers.length === 0 ? 'No firms registered yet.' : 'No results match your search.'}
                  </div>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface)' }}>
                      {['Firm Name', 'GSTIN', 'Type', 'Industry', 'Registered', 'Docs', 'Applications', 'Status', ''].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c, i) => {
                      const apps = c.creditApplications || []
                      const approved = apps.find(a => a.status === 'approved')
                      return (
                        <tr key={c.id} style={{ borderBottom: '1px solid var(--border-soft)', transition: 'background 0.1s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{c.firmName}</div>
                            <div style={{ fontSize: 11, color: 'var(--slate)' }}>{c.propName}</div>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--ink-muted)', fontFamily: 'monospace' }}>{c.gstin}</td>
                          <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--slate)' }}>{c.firmType}</td>
                          <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--slate)' }}>{c.industry}</td>
                          <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--slate)' }}>{new Date(c.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: Object.keys(c.documents || {}).length >= 3 ? 'var(--success)' : 'var(--warning)' }}>
                              {Object.keys(c.documents || {}).length}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: apps.length > 0 ? 'var(--ink)' : 'var(--slate)' }}>
                              {apps.length}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            {approved ? (
                              <span className="badge badge-success"><CheckCircle size={9} /> Approved</span>
                            ) : apps.length > 0 ? (
                              <span className="badge badge-warning"><Clock size={9} /> Pending</span>
                            ) : (
                              <span className="badge badge-info">Onboarded</span>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <button onClick={() => setSelectedCustomer(c)} style={{
                              background: 'none', border: '1px solid var(--border)', borderRadius: 7,
                              padding: '5px 10px', fontSize: 12, color: 'var(--ink)', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                              View <ChevronRight size={12} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="animate-fade">
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, color: 'var(--ink)', marginBottom: 4 }}>All Credit Applications</h2>
              <p style={{ color: 'var(--slate)', fontSize: 13 }}>{allApps.length} total applications</p>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {allApps.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                  <CreditCard size={40} color="var(--border)" style={{ marginBottom: 12 }} />
                  <div style={{ color: 'var(--slate)' }}>No applications submitted yet.</div>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface)' }}>
                      {['Application ID', 'Firm', 'Requested', 'Facility', 'Purpose', 'Tenure', 'Approved', 'Grade', 'Rate', 'Status', 'Date'].map(h => (
                        <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allApps.map((app, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border-soft)', fontSize: 12 }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ink-muted)', fontSize: 11 }}>{app.applicationId}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{app.firmName}</div>
                          <div style={{ color: 'var(--slate)', fontSize: 10 }}>{app.gstin}</div>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>₹{Number(app.requestedAmount).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '12px 14px', color: 'var(--slate)' }}>{app.facilityType?.split(' ')[0]}</td>
                        <td style={{ padding: '12px 14px', color: 'var(--slate)' }}>{app.purpose}</td>
                        <td style={{ padding: '12px 14px', color: 'var(--slate)' }}>{app.tenure}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--success)' }}>
                          {app.approvedAmount ? `₹${Number(app.approvedAmount).toLocaleString('en-IN')}` : '—'}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: 'var(--gold-dark)' }}>{app.riskGrade || '—'}</span>
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--ink)' }}>{app.interestRate ? `${app.interestRate}%` : '—'}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span className={`badge badge-${app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}`}>
                            {app.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--slate)', whiteSpace: 'nowrap' }}>
                          {new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
