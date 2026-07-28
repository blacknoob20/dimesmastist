import { Router, Route, Switch as WSwitch, useLocation } from 'wouter-preact'
import { Topbar } from '@/components/chrome/Topbar'
import { Navbar } from '@/components/chrome/Navbar'
import { CoinPage } from '@/components/coin/CoinPage'
import { CoinForm } from '@/components/coin/CoinForm'
import { NotFound } from '@/components/NotFound'

const RouteContent = () => {
  const [location] = useLocation()

  return (
    <div key={location} class="route-enter">
      <WSwitch>
        <Route path="/" component={CoinPage} />
        <Route path="/home" component={CoinPage} />
        <Route path="/coins" component={CoinForm} />
        <Route component={NotFound} />
      </WSwitch>
    </div>
  )
}

export const AppRouter = () => (
  <Router>
    <div class="min-h-screen bg-brand-bg">
      <Topbar />
      <Navbar />
      <RouteContent />
    </div>
  </Router>
)
