import { useEffect, useState } from 'react';
import { RouteKey } from './types/temple';
import { TempleDataProvider } from './context/TempleDataContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DonateModal } from './components/DonateModal';
import { HomePage } from './pages/HomePage';
import { CalendarPage } from './pages/CalendarPage';
import { GalleryPage } from './pages/GalleryPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

const VALID_ROUTES: RouteKey[] = ['home', 'calendar', 'gallery', 'services', 'contact', 'admin'];

function getRouteFromHash(): RouteKey {
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase() as RouteKey;
  return VALID_ROUTES.includes(hash) ? hash : 'home';
}

function TempleShell() {
  const [activeRoute, setActiveRoute] = useState<RouteKey>(getRouteFromHash);
  const [donateOpen, setDonateOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => setActiveRoute(getRouteFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (route: RouteKey) => {
    setActiveRoute(route);
    if (window.location.hash !== `#${route}`) {
      window.history.pushState(null, '', `#${route}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] dark:bg-[#120F0D] text-[#1C1714] dark:text-[#F6F1EA] transition-colors duration-200">
      <Navbar
        activeRoute={activeRoute}
        onNavigate={navigate}
        onOpenDonate={() => setDonateOpen(true)}
      />

      <main className="flex-1">
        {activeRoute === 'home' && (
          <HomePage onNavigate={navigate} onOpenDonate={() => setDonateOpen(true)} />
        )}
        {activeRoute === 'calendar' && <CalendarPage />}
        {activeRoute === 'gallery' && <GalleryPage />}
        {activeRoute === 'services' && <ServicesPage />}
        {activeRoute === 'contact' && <ContactPage />}
        {activeRoute === 'admin' && <AdminPage onNavigate={navigate} />}
      </main>

      <Footer onNavigate={navigate} onOpenDonate={() => setDonateOpen(true)} />
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TempleDataProvider>
        <TempleShell />
      </TempleDataProvider>
    </ThemeProvider>
  );
}
