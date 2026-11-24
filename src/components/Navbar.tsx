import React, { useState } from 'react';
import {
  Calendar,
  Home,
  Images,
  Phone,
  ShieldCheck,
  Menu,
  X,
  HeartHandshake,
  Compass,
  Moon,
  Sun,
} from 'lucide-react';
import { RouteKey } from '../types/temple';
import { useTempleData } from '../context/TempleDataContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  activeRoute: RouteKey;
  onNavigate: (route: RouteKey) => void;
  onOpenDonate: () => void;
}

const DESKTOP_NAV: { key: RouteKey; label: string }[] = [
  { key: 'calendar', label: 'Calendar' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'services', label: 'Services' },
  { key: 'contact', label: 'Contact' },
  { key: 'admin', label: 'Admin' },
];

const MOBILE_TABS: { key: RouteKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'calendar', label: 'Calendar', icon: Calendar },
  { key: 'gallery', label: 'Gallery', icon: Images },
  { key: 'contact', label: 'Contact', icon: Phone },
  { key: 'admin', label: 'Admin', icon: ShieldCheck },
];

export const Navbar: React.FC<NavbarProps> = ({ activeRoute, onNavigate, onOpenDonate }) => {
  const { data } = useTempleData();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (route: RouteKey) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop & Mobile Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F4]/95 dark:bg-[#161210]/95 backdrop-blur-md border-b border-[#E5DDD0] dark:border-[#2F2722] pt-safe transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-13 md:h-16 flex items-center justify-between gap-3 md:gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="font-serif text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#1C1714] dark:text-[#F6F1EA] hover:text-[#9A3412] dark:hover:text-[#F08A5D] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A3412] rounded-sm"
          >
            {data.settings.templeName}
          </button>

          {/* Zone 2 (Desktop): 5 single-line nav links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#544A41] dark:text-[#CFC4B7]"
          >
            {DESKTOP_NAV.map((item) => {
              const isActive = activeRoute === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleNav(item.key)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A3412] rounded-sm ${
                    isActive
                      ? 'text-[#9A3412] dark:text-[#F08A5D] font-semibold'
                      : 'text-[#544A41] dark:text-[#CFC4B7] hover:text-[#1C1714] dark:hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#9A3412] dark:bg-[#F08A5D]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Theme Toggle + Primary Action */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg border border-[#E5DDD0] dark:border-[#3A302A] bg-white dark:bg-[#221C18] text-[#4E443B] dark:text-[#E6C594] hover:border-[#9A3412] dark:hover:border-[#F08A5D] transition-colors cursor-pointer shrink-0"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onOpenDonate}
              className="px-4 py-2 min-h-[40px] rounded-lg bg-[#9A3412] dark:bg-[#B4411B] text-[#FAF8F4] text-xs sm:text-sm font-semibold hover:bg-[#7C2D12] dark:hover:bg-[#C74B21] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A3412]"
            >
              Donate
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#1C1714] dark:text-[#F6F1EA] hover:bg-[#EFE9DF] dark:hover:bg-[#251F1B] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Down Drawer for Services, Membership & Quick Links */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/55 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-0 left-0 right-0 bg-[#FAF8F4] dark:bg-[#1A1512] border-b border-[#E5DDD0] dark:border-[#2F2722] rounded-b-3xl p-5 pt-safe shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DDD0] dark:border-[#2F2722]">
              <span className="font-serif text-xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                {data.settings.templeName}
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#1C1714] dark:text-[#F6F1EA] hover:bg-[#EFE9DF] dark:hover:bg-[#251F1B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 divide-y divide-[#EDE6DA] dark:divide-[#2A231E]">
              {[
                { key: 'home' as RouteKey, label: 'Home & Timings', sub: 'Darshan, News & Festivals' },
                { key: 'services' as RouteKey, label: 'Services, Vidyalaya & Board', sub: 'Priest, Rentals, Bereavement & History' },
                { key: 'calendar' as RouteKey, label: 'Temple & Prasadam Calendar', sub: '2026 CST Festivals & Bookings' },
                { key: 'gallery' as RouteKey, label: 'Full Photo Gallery', sub: 'Deities, Rath Yatra & Heritage' },
                { key: 'contact' as RouteKey, label: 'Contact & Directions', sub: '3307 Pasqua St., Regina' },
                { key: 'admin' as RouteKey, label: 'Admin Management Console', sub: 'Edit Calendar, Gallery, News & Settings' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleNav(item.key)}
                  className="w-full min-h-[56px] py-3 flex items-center justify-between text-left active:bg-[#EFE9DF] dark:active:bg-[#251F1B] rounded-lg px-2 transition-colors"
                >
                  <div>
                    <div
                      className={`text-sm font-semibold ${
                        activeRoute === item.key
                          ? 'text-[#9A3412] dark:text-[#F08A5D]'
                          : 'text-[#1C1714] dark:text-[#F6F1EA]'
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="text-xs text-[#665B51] dark:text-[#A99C8E]">{item.sub}</div>
                  </div>
                  <Compass className="w-4 h-4 text-[#9A8B7A] dark:text-[#8E8072]" />
                </button>
              ))}
            </div>

            <div className="pt-3 grid grid-cols-2 gap-3">
              <a
                href={`tel:${data.settings.priestPhone.replace(/[^0-9]/g, '')}`}
                className="min-h-[44px] px-3 py-2.5 rounded-xl border border-[#D9CEBE] dark:border-[#3A302A] bg-white dark:bg-[#221C18] text-xs font-medium text-[#1C1714] dark:text-[#F6F1EA] flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#9A3412] dark:text-[#F08A5D]" />
                Call Priest
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDonate();
                }}
                className="min-h-[44px] px-3 py-2.5 rounded-xl bg-[#9A3412] dark:bg-[#B4411B] text-xs font-medium text-white flex items-center justify-center gap-1.5"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                Interac Seva
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Thumb-Zone Navigation (iOS & Android) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F4]/95 dark:bg-[#161210]/95 backdrop-blur-md border-t border-[#E5DDD0] dark:border-[#2F2722] pb-safe transition-colors duration-200"
      >
        <div className="grid grid-cols-5 h-16 items-center">
          {MOBILE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeRoute === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleNav(tab.key)}
                className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#9A3412] dark:text-[#F08A5D]'
                    : 'text-[#6B6056] dark:text-[#A99C8E]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
                <span className={`text-[10px] leading-none tracking-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
