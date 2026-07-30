import { Router, Route, Switch as WSwitch, useLocation } from 'wouter-preact'
import { Topbar } from '@/components/chrome/Topbar'
import { Navbar } from '@/components/chrome/Navbar'
import { LandingPage } from '@/pages/LandingPage'
import { CatalogPage } from '@/pages/CatalogPage'
import { CatalogDetailPage } from '@/pages/CatalogDetailPage'
import { MyCollectionPage } from '@/pages/MyCollectionPage'
import { InstanceFormPage } from '@/pages/InstanceFormPage'
import { InstanceDetailPage } from '@/pages/InstanceDetailPage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { AboutPage } from '@/pages/AboutPage'
import { NotFound } from '@/components/NotFound'

const RouteContent = () => {
  const [location] = useLocation()

  return (
    <div key={location} class="route-enter">
      <WSwitch>
        <Route path="/" component={LandingPage} />
        <Route path="/catalogo" component={CatalogPage} />
        <Route path="/catalogo/:id" component={CatalogDetailPage} />
        <Route path="/mi-coleccion" component={MyCollectionPage} />
        <Route path="/mi-coleccion/registrar" component={InstanceFormPage} />
        <Route path="/mi-coleccion/:id" component={InstanceDetailPage} />
        <Route path="/favoritos" component={FavoritesPage} />
        <Route path="/acerca" component={AboutPage} />
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
