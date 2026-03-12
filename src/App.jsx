import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import CreditApplicationPage from './pages/CreditApplicationPage.jsx'
import MasterDashboard from './pages/MasterDashboard.jsx'
import MasterLogin from './pages/MasterLogin.jsx'

export default function App() {
  const [page, setPage] = useState('landing')
  const [currentUser, setCurrentUser] = useState(null)
  const [isMaster, setIsMaster] = useState(false)

  // Restore session
  useEffect(() => {
    const session = localStorage.getItem('cf_session')
    if (session) {
      const s = JSON.parse(session)
      if (s.isMaster) { setIsMaster(true); setPage('master-dashboard') }
      else { setCurrentUser(s.user); setPage('dashboard') }
    }
  }, [])

  const navigate = (p, user = null) => {
    setPage(p)
    if (user) setCurrentUser(user)
  }

  const logout = () => {
    localStorage.removeItem('cf_session')
    setCurrentUser(null)
    setIsMaster(false)
    setPage('landing')
  }

  const pages = {
    landing: <LandingPage navigate={navigate} />,
    onboarding: <OnboardingPage navigate={navigate} />,
    login: <LoginPage navigate={navigate} setCurrentUser={setCurrentUser} />,
    dashboard: <DashboardPage user={currentUser} navigate={navigate} logout={logout} />,
    'credit-application': <CreditApplicationPage user={currentUser} navigate={navigate} />,
    'master-login': <MasterLogin navigate={navigate} setIsMaster={setIsMaster} />,
    'master-dashboard': <MasterDashboard navigate={navigate} logout={logout} />,
  }

  return pages[page] || pages['landing']
}
