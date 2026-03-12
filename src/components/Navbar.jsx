import { LogOut, ChevronRight } from 'lucide-react'

export default function Navbar({ user, onLogout, navigate, showBack, backPage, backLabel }) {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 32px',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <button onClick={() => navigate && navigate('landing')}
          style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{
            width: 34, height: 34, background: 'var(--ink)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--gold)', fontSize: 16, fontFamily: 'DM Serif Display, serif', fontWeight: 400,
          }}>C</div>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            CredFlow
          </span>
        </button>
        {showBack && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--slate)', fontSize: 13 }}>
            <ChevronRight size={14} />
            <button onClick={() => navigate(backPage)}
              style={{ background: 'none', border: 'none', color: 'var(--slate)', fontSize: 13, cursor: 'pointer' }}>
              {backLabel}
            </button>
          </div>
        )}
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{user.firmName}</div>
            <div style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: '0.03em' }}>{user.gstin}</div>
          </div>
          <div style={{
            width: 36, height: 36, background: 'var(--ink)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--gold)', fontSize: 14, fontFamily: 'DM Serif Display, serif',
          }}>{user.firmName?.[0] || 'A'}</div>
          <button onClick={onLogout} className="btn-outline" style={{ padding: '8px 16px', fontSize: 13 }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      )}
    </nav>
  )
}
