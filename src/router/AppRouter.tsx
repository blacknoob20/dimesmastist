import { Router, Route, Switch as WSwitch } from 'wouter-preact'
import { Topbar } from '@/components/chrome/Topbar'
import { Navbar } from '@/components/chrome/Navbar'
import { CoinPage } from '@/components/coin/CoinPage'
import { CoinForm } from '@/components/coin/CoinForm'
import { NotFound } from '@/components/NotFound'
import { ViewTransitionProvider } from '@/hooks/useViewTransition'

export const AppRouter = () => (
  <ViewTransitionProvider>
    <Router>
      <div class="min-h-screen bg-brand-bg">
        <Topbar />
        <Navbar />
        <WSwitch>
          <Route path="/" component={CoinPage} />
          <Route path="/home" component={CoinPage} />
          <Route path="/coins" component={CoinForm} />
          <Route component={NotFound} />
        </WSwitch>
      </div>
    </Router>
  </ViewTransitionProvider>
)
