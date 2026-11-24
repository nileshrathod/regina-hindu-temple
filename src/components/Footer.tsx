import React from 'react';
import { ExternalLink } from 'lucide-react';
import { RouteKey } from '../types/temple';
import { useTempleData } from '../context/TempleDataContext';

interface FooterProps {
  onNavigate: (route: RouteKey) => void;
  onOpenDonate: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDonate }) => {
  const { data } = useTempleData();
  const { settings } = data;

  const go = (route: RouteKey) => {
    onNavigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C1714] dark:bg-[#0D0A08] text-[#E9E2D8] border-t border-[#322A24] dark:border-[#26201C] pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#322A24]">
          {/* Column 1: Temple Identity */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white">
              {settings.templeName}
            </h3>
            <p className="text-sm text-[#BFB5A8] leading-relaxed max-w-md">
              {settings.organizationName} · Established {settings.establishedDate} · Opened {settings.openedDate}.
            </p>
            <div className="text-sm text-[#D8CFC3] space-y-1 tabular-nums">
              <p>{settings.address}, {settings.cityProvincePostal}</p>
              <p>
                Temple Line:{' '}
                <a href={`tel:${settings.templePhone.replace(/[^0-9]/g, '')}`} className="underline underline-offset-4 hover:text-white">
                  {settings.templePhone}
                </a>
              </p>
              <p>
                Priest ({settings.priestName}):{' '}
                <a href={`tel:${settings.priestPhone.replace(/[^0-9]/g, '')}`} className="underline underline-offset-4 hover:text-white">
                  {settings.priestPhone}
                </a>
              </p>
              <p>
                Interac & Email:{' '}
                <a href={`mailto:${settings.interacEmail}`} className="underline underline-offset-4 hover:text-white">
                  {settings.interacEmail}
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs tracking-widest uppercase text-[#A49889] font-medium">
              Temple Portal
            </p>
            <ul className="space-y-2.5 text-sm text-[#D8CFC3]">
              {[
                { key: 'home' as RouteKey, label: 'Home & Timings' },
                { key: 'calendar' as RouteKey, label: '2026 Festival & Prasadam Calendar' },
                { key: 'gallery' as RouteKey, label: 'Full Photo Gallery' },
                { key: 'services' as RouteKey, label: 'Services, Vidyalaya & Board' },
                { key: 'contact' as RouteKey, label: 'Contact & Directions' },
                { key: 'admin' as RouteKey, label: 'Admin Management Panel' },
              ].map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => go(item.key)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Seva & Community Channels */}
          <div className="md:col-span-4 space-y-4">
            <p className="text-xs tracking-widest uppercase text-[#A49889] font-medium">
              Offerings & Community
            </p>
            <p className="font-serif text-base text-[#E6C594] leading-relaxed">
              {settings.donationShloka}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={onOpenDonate}
                className="px-4 py-2 min-h-[40px] rounded-lg bg-[#9A3412] text-white text-xs font-medium hover:bg-[#B4411B] transition-colors cursor-pointer whitespace-nowrap"
              >
                Interac Donations
              </button>
              <a
                href={settings.membershipFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 min-h-[40px] rounded-lg border border-[#4A3F37] text-[#E9E2D8] text-xs font-medium hover:border-[#8C7B6B] hover:text-white transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                2026 Membership
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="flex items-center gap-5 pt-2 text-xs text-[#BFB5A8]">
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white underline underline-offset-4">
                Facebook
              </a>
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white underline underline-offset-4">
                Instagram
              </a>
              <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white underline underline-offset-4">
                YouTube
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#9E9183]">
          <p>© {new Date().getFullYear()} {settings.organizationName}. All rights reserved.</p>
          <p>3307 Pasqua St., Regina, Saskatchewan · Non-Profit Religious Organization</p>
        </div>
      </div>
    </footer>
  );
};
