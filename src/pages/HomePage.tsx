import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarPlus,
  Check,
  Copy,
  ExternalLink,
  MapPin,
  Phone,
  X,
} from 'lucide-react';
import { NewsItem, RouteKey } from '../types/temple';
import { useTempleData } from '../context/TempleDataContext';
import { SafeImage } from '../components/SafeImage';
import { downloadEventIcs } from '../utils/ics';

interface HomePageProps {
  onNavigate: (route: RouteKey) => void;
  onOpenDonate: () => void;
}

function formatReadableDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenDonate }) => {
  const { data } = useTempleData();
  const { settings, schedules, events, news, gallery } = data;
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [copiedInterac, setCopiedInterac] = useState(false);

  const publishedNews = useMemo(
    () =>
      news
        .filter((n) => n.published)
        .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || b.date.localeCompare(a.date)),
    [news]
  );

  const upcomingEvents = useMemo(() => {
    const today = '2026-11-24';
    const future = events.filter((e) => e.date >= today && (e.category === 'festival' || e.category === 'hours'));
    const pool = future.length >= 4 ? future : events.filter((e) => e.featured || e.category === 'festival');
    return pool.slice(0, 6);
  }, [events]);

  const featuredPhotos = useMemo(() => {
    const picks = gallery.filter((g) => g.featured);
    return (picks.length >= 4 ? picks : gallery).slice(0, 4);
  }, [gallery]);

  const copyInterac = async () => {
    try {
      await navigator.clipboard.writeText(settings.interacEmail);
      setCopiedInterac(true);
      setTimeout(() => setCopiedInterac(false), 2400);
    } catch {
      setCopiedInterac(false);
    }
  };

  const pillars = [
    {
      index: '01',
      title: 'Pooja, Yajña & Havan',
      body: 'Vedic rituals, personal poojas, and community havans are performed regularly by Pt. Dharmesh Dave. Monthly Havan is observed on the last Sunday from 9:30 AM to 11:00 AM.',
      actionLabel: `Call ${settings.priestName}`,
      href: `tel:${settings.priestPhone.replace(/[^0-9]/g, '')}`,
    },
    {
      index: '02',
      title: 'Hindu Vidyalaya',
      body: 'Sunday School runs every Sunday from 10:30 AM to 11:30 AM for Pre-K to Grade 12, nurturing Indian languages, shlokas, scriptures, and Dharma ethics.',
      actionLabel: 'Register for 2026',
      href: settings.vidyalayaFormUrl,
      external: true,
    },
    {
      index: '03',
      title: 'Sunday Prasadam Seva',
      body: 'Congregational Prasadam is lovingly served every Sunday after morning Satsang and on major festivals. Families may sponsor a Sunday through our coordinator.',
      actionLabel: `Sponsor · ${settings.prasadamPhone}`,
      href: `tel:${settings.prasadamPhone.replace(/[^0-9]/g, '')}`,
    },
    {
      index: '04',
      title: 'Temple & Kitchen Usage',
      body: 'The temple sanctuary and Bhavan kitchen are available for rent for personal or community religious events (minimum 2-hour booking).',
      actionLabel: `Rentals · ${settings.rentalPhone}`,
      href: `tel:${settings.rentalPhone.replace(/[^0-9]/g, '')}`,
    },
    {
      index: '05',
      title: 'Major Religious Festivals',
      body: 'Maha Shivratri, Holi, Ram Navami, Rath Yatra, Janmashtami, Navratri, Dussehra, and Diwali are celebrated together according to Regina CST timings.',
      actionLabel: 'View 2026 Calendar',
      route: 'calendar' as RouteKey,
    },
    {
      index: '06',
      title: 'Bereavement Support',
      body: 'Our dedicated Bereavement Committee assists Hindu families with funeral and cremation arrangements, Shanti Paath, and compassionate guidance.',
      actionLabel: 'Committee Directory',
      route: 'services' as RouteKey,
    },
  ];

  return (
    <div className="bg-[#FAF8F4] dark:bg-[#120F0D] transition-colors duration-200">
      {/* Quiet Sacred Mantra & Community Notice Strip */}
      <div className="bg-[#F2EDE4] dark:bg-[#1A1512] border-b border-[#E5DDD0] dark:border-[#2F2722]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col lg:flex-row items-center justify-between gap-1.5 text-center lg:text-left">
          <p className="font-serif text-sm sm:text-base text-[#7C2D12] dark:text-[#E6C594] font-medium tracking-wide">
            {settings.mantra}
          </p>
          <p className="text-xs text-[#5E5247] dark:text-[#BFB5A8] truncate max-w-full">
            {settings.tickerNotice}
          </p>
        </div>
      </div>

      {/* Cinematic Sanctum Hero */}
      <section className="relative bg-[#16110E] text-white overflow-hidden">
        <div className="relative min-h-[460px] sm:min-h-[540px] lg:min-h-[600px] flex items-end">
          <SafeImage
            src="./images/temple/01_home_1596a445.jpg"
            alt="Main marble deities sanctum at Regina Hindu Temple"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#16110E] via-[#16110E]/65 to-[#16110E]/25"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pb-16">
            <div className="max-w-3xl space-y-5">
              <p className="text-xs sm:text-sm tracking-[0.14em] uppercase text-[#E6C594] font-medium">
                {settings.organizationName} · Est. 1987
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white">
                {settings.heroTitle}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-[#E4DBD0] leading-relaxed max-w-2xl">
                {settings.heroSubtitle}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('calendar')}
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-[#9A3412] text-white text-sm font-semibold hover:bg-[#B4411B] active:scale-[0.98] transition-all inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  View 2026 Calendar
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('gallery')}
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-white/12 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white text-sm font-medium transition-all whitespace-nowrap cursor-pointer"
                >
                  Explore Photo Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Utility Ribbon (4-Column Full-Width Strip below Hero) */}
      <section aria-label="Temple Essential Information" className="bg-white dark:bg-[#1C1714] border-b border-[#E5DDD0] dark:border-[#2F2722]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#EDE6DA] dark:divide-[#2F2722]">
            <div className="py-5 sm:px-5 first:sm:pl-0">
              <p className="text-xs text-[#7D6E5D] dark:text-[#A99C8E]">Sunday Satsang & Prasadam</p>
              <p className="text-sm sm:text-base font-semibold text-[#1C1714] dark:text-[#F6F1EA] mt-1 tabular-nums">
                10:30 AM – 1:00 PM
              </p>
              <p className="text-xs text-[#665B51] dark:text-[#BFB5A8] mt-0.5">Vidyalaya 10:30 – 11:30 AM</p>
            </div>

            <div className="py-5 sm:px-5">
              <p className="text-xs text-[#7D6E5D] dark:text-[#A99C8E]">Weekday Evening Darshan</p>
              <p className="text-sm sm:text-base font-semibold text-[#1C1714] dark:text-[#F6F1EA] mt-1 tabular-nums">
                Mon & Tue · 7:30 – 9:00 PM
              </p>
              <p className="text-xs text-[#665B51] dark:text-[#BFB5A8] mt-0.5">Last Sunday Havan 9:30 AM</p>
            </div>

            <div className="py-5 sm:px-5">
              <p className="text-xs text-[#7D6E5D] dark:text-[#A99C8E]">Temple Priest · Pooja & Rituals</p>
              <a
                href={`tel:${settings.priestPhone.replace(/[^0-9]/g, '')}`}
                className="text-sm sm:text-base font-semibold text-[#9A3412] dark:text-[#F08A5D] hover:underline mt-1 inline-flex items-center gap-1.5 tabular-nums"
              >
                <Phone className="w-3.5 h-3.5" />
                {settings.priestPhone}
              </a>
              <p className="text-xs text-[#665B51] dark:text-[#BFB5A8] mt-0.5">{settings.priestName}</p>
            </div>

            <div className="py-5 sm:px-5 last:sm:pr-0">
              <p className="text-xs text-[#7D6E5D] dark:text-[#A99C8E]">Temple Sanctuary</p>
              <a
                href="https://maps.google.com/?q=3307+Pasqua+St+Regina+SK+S4S+7G8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base font-semibold text-[#1C1714] dark:text-[#F6F1EA] hover:text-[#9A3412] dark:hover:text-[#F08A5D] mt-1 inline-flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-[#9A3412] dark:text-[#F08A5D] shrink-0" />
                {settings.address}
              </a>
              <p className="text-xs text-[#665B51] dark:text-[#BFB5A8] mt-0.5">Regina, SK · S4S 7G8</p>
            </div>
          </div>
        </div>
      </section>

      {/* Temple News & Upcoming Festivals (Asymmetric Editorial Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left 7 Cols: Latest News & Community Announcements */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-end justify-between gap-4 border-b border-[#E5DDD0] dark:border-[#2F2722] pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#7D6E5D] dark:text-[#A99C8E]">
                  Bulletin & Announcements
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1">
                  Temple News & Notices
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="text-xs font-medium text-[#7D6E5D] dark:text-[#A99C8E] hover:text-[#9A3412] dark:hover:text-[#F08A5D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Manage in Admin →
              </button>
            </div>

            <div className="divide-y divide-[#E5DDD0] dark:divide-[#2F2722]">
              {publishedNews.map((item) => (
                <article key={item.id} className="py-5 first:pt-1">
                  <div className="flex items-center gap-2 text-xs text-[#7D6E5D] dark:text-[#A99C8E] tabular-nums">
                    <span className="font-semibold text-[#9A3412] dark:text-[#F08A5D]">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatReadableDate(item.date)}</span>
                    {item.pinned && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#1C1714] dark:text-[#F6F1EA] font-semibold">Pinned Notice</span>
                      </>
                    )}
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedNews(item)}
                      className="text-left hover:text-[#9A3412] dark:hover:text-[#F08A5D] transition-colors cursor-pointer"
                    >
                      {item.title}
                    </button>
                  </h3>
                  <p className="text-sm text-[#544A41] dark:text-[#CFC4B7] leading-relaxed mt-2">{item.summary}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedNews(item)}
                    className="mt-3 text-xs font-semibold text-[#9A3412] dark:text-[#F08A5D] hover:text-[#7C2D12] dark:hover:text-[#F6B28D] inline-flex items-center gap-1 cursor-pointer"
                  >
                    Read full notice
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </article>
              ))}
            </div>
          </div>

          {/* Right 5 Cols: Upcoming Festivals & Schedule */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-end justify-between gap-4 border-b border-[#E5DDD0] dark:border-[#2F2722] pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#7D6E5D] dark:text-[#A99C8E]">
                  Vikram Samvat 2080–2081
                </p>
                <h2 className="font-serif text-3xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1">
                  Upcoming Dates
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('calendar')}
                className="text-xs font-semibold text-[#9A3412] dark:text-[#F08A5D] hover:text-[#7C2D12] dark:hover:text-[#F6B28D] whitespace-nowrap shrink-0 cursor-pointer"
              >
                Full Calendar →
              </button>
            </div>

            <div className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl divide-y divide-[#EDE6DA] dark:divide-[#2A231E]">
              {upcomingEvents.map((evt) => {
                const d = new Date(`${evt.date}T12:00:00`);
                const month = d.toLocaleDateString('en-CA', { month: 'short' });
                const day = d.getDate();
                return (
                  <div key={evt.id} className="p-4 sm:p-5 flex items-start gap-4">
                    <div className="w-12 shrink-0 text-center py-1.5 rounded-lg bg-[#F2EDE4] dark:bg-[#251F1B] border border-[#E5DDD0] dark:border-[#362D27]">
                      <div className="text-[11px] uppercase tracking-wider text-[#9A3412] dark:text-[#F08A5D] font-semibold">
                        {month}
                      </div>
                      <div className="text-lg font-bold text-[#1C1714] dark:text-[#F6F1EA] leading-tight tabular-nums">
                        {day}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-[#1C1714] dark:text-[#F6F1EA] leading-snug">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-[#665B51] dark:text-[#BFB5A8] mt-1 tabular-nums">{evt.time}</p>
                      <p className="text-xs text-[#7D6E5D] dark:text-[#A99C8E] mt-1 line-clamp-2">{evt.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadEventIcs(evt)}
                      title="Save to iPhone / Android Calendar (.ics)"
                      aria-label={`Add ${evt.title} to calendar`}
                      className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#665B51] dark:text-[#BFB5A8] hover:text-[#9A3412] dark:hover:text-[#F08A5D] hover:bg-[#FAF8F4] dark:hover:bg-[#251F1B] transition-colors shrink-0 cursor-pointer"
                    >
                      <CalendarPlus className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Temple Schedule Band */}
      <section className="bg-[#F2EDE4] dark:bg-[#191411] border-y border-[#E5DDD0] dark:border-[#2F2722] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7D6E5D] dark:text-[#A99C8E]">Regular Hours</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1">
              Weekly Temple Schedule
            </h2>
            <p className="text-sm sm:text-base text-[#544A41] dark:text-[#CFC4B7] mt-2 leading-relaxed">
              Regular programs are tentative and subject to adjustment during major festival celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {schedules.map((slot) => (
              <div
                key={slot.id}
                className="bg-[#FAF8F4] dark:bg-[#221C18] border border-[#E2D8C9] dark:border-[#342B25] rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs text-[#9A3412] dark:text-[#F08A5D] font-semibold">{slot.frequency}</p>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1">
                    {slot.title}
                  </h3>
                  <p className="text-sm font-semibold text-[#3B3026] dark:text-[#E4DBD0] mt-2 tabular-nums">
                    {slot.timing}
                  </p>
                </div>
                {slot.note && (
                  <p className="text-xs text-[#665B51] dark:text-[#BFB5A8] mt-4 pt-4 border-t border-[#EAE2D6] dark:border-[#322924] leading-relaxed">
                    {slot.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Six Pillars of Temple Community Life */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E5DDD0] dark:border-[#2F2722]">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7D6E5D] dark:text-[#A99C8E]">
              Devotion, Learning & Seva
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1">
              Temple Programs & Community Services
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="text-sm font-semibold text-[#9A3412] dark:text-[#F08A5D] hover:text-[#7C2D12] dark:hover:text-[#F6B28D] inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            All Services, Board & History
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 pt-10">
          {pillars.map((pillar) => (
            <div key={pillar.index} className="flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-[#9A3412] dark:text-[#F08A5D] tabular-nums">
                  {pillar.index}.
                </p>
                <h3 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#544A41] dark:text-[#CFC4B7] leading-relaxed mt-2.5">
                  {pillar.body}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#EDE6DA] dark:border-[#2A231E]">
                {pillar.route ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(pillar.route!)}
                    className="text-xs font-semibold text-[#1C1714] dark:text-[#F6F1EA] hover:text-[#9A3412] dark:hover:text-[#F08A5D] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {pillar.actionLabel}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <a
                    href={pillar.href}
                    target={pillar.external ? '_blank' : undefined}
                    rel={pillar.external ? 'noopener noreferrer' : undefined}
                    className="text-xs font-semibold text-[#1C1714] dark:text-[#F6F1EA] hover:text-[#9A3412] dark:hover:text-[#F08A5D] inline-flex items-center gap-1.5 tabular-nums"
                  >
                    {pillar.actionLabel}
                    {pillar.external ? (
                      <ExternalLink className="w-3.5 h-3.5" />
                    ) : (
                      <Phone className="w-3.5 h-3.5 text-[#9A3412] dark:text-[#F08A5D]" />
                    )}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Glimpse of Rath Yatra 2025 & Archival Photography Showcase */}
      <section className="bg-white dark:bg-[#191411] border-y border-[#E5DDD0] dark:border-[#2F2722] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#7D6E5D] dark:text-[#A99C8E]">
                Sanctum, Festivals & Archive (1989–2025)
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1">
                Glimpses of Temple Life & Rath Yatra
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('gallery')}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#D4C7B5] dark:border-[#3A302A] text-sm font-medium text-[#1C1714] dark:text-[#F6F1EA] hover:border-[#9A3412] dark:hover:border-[#F08A5D] hover:text-[#9A3412] dark:hover:text-[#F08A5D] transition-colors inline-flex items-center gap-2 whitespace-nowrap self-start sm:self-auto cursor-pointer"
            >
              Open Full Gallery ({gallery.length} Photos)
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {featuredPhotos[0] && (
              <button
                type="button"
                onClick={() => onNavigate('gallery')}
                className="md:col-span-7 group relative rounded-2xl overflow-hidden bg-[#F2EDE4] dark:bg-[#251F1B] aspect-[16/10] text-left cursor-pointer"
              >
                <SafeImage
                  src={featuredPhotos[1]?.src || featuredPhotos[0].src}
                  alt={featuredPhotos[1]?.title || featuredPhotos[0].title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white">
                  <p className="text-xs text-[#E6C594]">
                    {(featuredPhotos[1] || featuredPhotos[0]).album} · {(featuredPhotos[1] || featuredPhotos[0]).year}
                  </p>
                  <p className="font-serif text-xl sm:text-2xl font-bold mt-1">
                    {(featuredPhotos[1] || featuredPhotos[0]).title}
                  </p>
                </div>
              </button>
            )}

            <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-5">
              {featuredPhotos.slice(2, 4).map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => onNavigate('gallery')}
                  className="group relative rounded-2xl overflow-hidden bg-[#F2EDE4] dark:bg-[#251F1B] aspect-[16/10] md:aspect-[16/8.5] text-left cursor-pointer"
                >
                  <SafeImage
                    src={photo.src}
                    alt={photo.title}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
                    <p className="text-xs text-[#E6C594]">
                      {photo.album} · {photo.year}
                    </p>
                    <p className="font-serif text-lg sm:text-xl font-bold mt-0.5 line-clamp-1">
                      {photo.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sacred Donations & Membership Appeal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="bg-[#F2EDE4] dark:bg-[#1C1714] border border-[#E2D8C9] dark:border-[#322924] rounded-3xl p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#9A3412] dark:text-[#F08A5D] font-semibold">
              Support the Temple · Seva & Membership
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
              Sustain Southern Saskatchewan’s Spiritual Home
            </h2>
            <p className="font-serif text-lg sm:text-xl text-[#7C2D12] dark:text-[#E6C594] leading-relaxed pt-1">
              {settings.donationShloka}
            </p>
            <p className="text-sm text-[#544A41] dark:text-[#CFC4B7] italic leading-relaxed max-w-2xl">
              “{settings.donationTranslation}”
            </p>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-[#14110F] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 space-y-4">
            <div>
              <p className="text-xs text-[#7D6E5D] dark:text-[#A99C8E]">Interac e-Transfer</p>
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-base font-semibold text-[#1C1714] dark:text-[#F6F1EA] break-all">
                  {settings.interacEmail}
                </span>
                <button
                  type="button"
                  onClick={copyInterac}
                  className="min-h-[40px] px-3.5 py-2 rounded-lg border border-[#D4C7B5] dark:border-[#3A302A] text-xs font-medium text-[#1C1714] dark:text-[#F6F1EA] hover:border-[#9A3412] dark:hover:border-[#F08A5D] hover:text-[#9A3412] dark:hover:text-[#F08A5D] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedInterac ? <Check className="w-3.5 h-3.5 text-[#15803D] dark:text-[#4ADE80]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedInterac ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenDonate}
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#9A3412] dark:bg-[#B4411B] text-white text-sm font-semibold hover:bg-[#7C2D12] dark:hover:bg-[#C74B21] transition-colors cursor-pointer"
              >
                Donation Details
              </button>
              <a
                href={settings.membershipFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#1C1714] dark:border-[#E4DBD0] text-[#1C1714] dark:text-[#F6F1EA] text-sm font-semibold hover:bg-[#1C1714] hover:text-white dark:hover:bg-[#F6F1EA] dark:hover:text-[#1C1714] transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                2026 Membership
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* News Reading Modal */}
      {selectedNews && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedNews(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full sm:max-w-xl bg-[#FAF8F4] dark:bg-[#1C1714] rounded-t-3xl sm:rounded-2xl border border-[#E5DDD0] dark:border-[#322924] shadow-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E5DDD0] dark:border-[#2F2722]">
              <div>
                <p className="text-xs text-[#9A3412] dark:text-[#F08A5D] font-semibold">
                  {selectedNews.category} · {formatReadableDate(selectedNews.date)}
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1">
                  {selectedNews.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                aria-label="Close notice"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#544A41] dark:text-[#CFC4B7] hover:bg-[#EFE9DF] dark:hover:bg-[#2A231E] cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm sm:text-base text-[#3B3026] dark:text-[#DDD3C7] leading-relaxed mt-5">
              {selectedNews.body}
            </p>
            <div className="mt-6 pt-4 border-t border-[#E5DDD0] dark:border-[#2F2722] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedNews(null);
                  onNavigate('contact');
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D4C7B5] dark:border-[#3A302A] text-sm font-medium text-[#1C1714] dark:text-[#F6F1EA] hover:bg-white dark:hover:bg-[#251F1B] cursor-pointer"
              >
                Contact Temple
              </button>
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#1C1714] dark:bg-[#F6F1EA] text-white dark:text-[#1C1714] text-sm font-semibold hover:bg-[#332A24] dark:hover:bg-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
