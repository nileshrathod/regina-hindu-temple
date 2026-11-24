import React, { useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  FileText,
  List,
  Phone,
  X,
} from 'lucide-react';
import { CalendarCategory, CalendarEvent } from '../types/temple';
import { useTempleData } from '../context/TempleDataContext';
import { downloadEventIcs } from '../utils/ics';
import { SafeImage } from '../components/SafeImage';

type FilterTab = 'all' | CalendarCategory;

const CATEGORY_LABELS: Record<CalendarCategory, string> = {
  festival: 'Festival',
  hours: 'Temple Hours',
  prasadam: 'Prasadam Seva',
  booking: 'Private Booking',
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDateLong(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-CA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export const CalendarPage: React.FC = () => {
  const { data } = useTempleData();
  const { settings, events } = data;

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 0-indexed: 10 = November 2026
  const [selectedDayIso, setSelectedDayIso] = useState<string | null>('2026-11-24');
  const [showPoster, setShowPoster] = useState(false);

  const filteredEvents = useMemo(() => {
    return events
      .filter((e) => activeTab === 'all' || e.category === activeTab)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [events, activeTab]);

  const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

  const monthEvents = useMemo(
    () => filteredEvents.filter((e) => e.date.startsWith(monthPrefix)),
    [filteredEvents, monthPrefix]
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const evt of filteredEvents) {
      const list = map.get(evt.date) || [];
      list.push(evt);
      map.set(evt.date, list);
    }
    return map;
  }, [filteredEvents]);

  const calendarCells = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const cells: ({ day: number; iso: string } | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, iso });
    }
    return cells;
  }, [currentYear, currentMonth]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDayIso) return monthEvents;
    return eventsByDate.get(selectedDayIso) || [];
  }, [selectedDayIso, eventsByDate, monthEvents]);

  const monthLabel = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-CA', {
    month: 'long',
    year: 'numeric',
  });

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDayIso(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDayIso(null);
  };

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All Schedules' },
    { key: 'festival', label: '2026 Festivals' },
    { key: 'hours', label: 'Temple Hours' },
    { key: 'prasadam', label: 'Prasadam Calendar' },
    { key: 'booking', label: 'Booking Calendar' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#120F0D] transition-colors duration-200">
      {/* Header */}
      <section className="bg-[#1C1714] dark:bg-[#0D0A08] text-white border-b border-[#322A24] dark:border-[#26201C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[#E6C594]">
                Vikram Samvat 2080–2081 · CST Regina, SK
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">
                Temple, Festival & Prasadam Calendar
              </h1>
              <p className="text-sm sm:text-base text-[#D4C9BC] leading-relaxed">
                Accurate CST festival timings for Regina, weekly Sunday Satsang, Prasadam sponsorships, and private hall booking schedules. Tap any event to add it directly to Apple or Google Calendar.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPoster(true)}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white/12 hover:bg-white/20 border border-white/25 text-white text-sm font-medium inline-flex items-center gap-2 whitespace-nowrap self-start lg:self-auto cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#E6C594]" />
              Official 2026 Festival Sheet
            </button>
          </div>
        </div>
      </section>

      {/* Coordinator Context Banner */}
      <section className="bg-[#F2EDE4] dark:bg-[#191411] border-b border-[#E5DDD0] dark:border-[#2F2722]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs sm:text-sm">
          {activeTab === 'prasadam' ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#3B3026] dark:text-[#DDD3C7]">
              <span className="font-semibold text-[#9A3412] dark:text-[#F08A5D]">Prasadam Seva Coordinator:</span>
              <span>{settings.prasadamCoordinator}</span>
              <a
                href={`tel:${settings.prasadamPhone.replace(/[^0-9]/g, '')}`}
                className="font-semibold text-[#1C1714] dark:text-[#F6F1EA] underline underline-offset-4 inline-flex items-center gap-1 tabular-nums"
              >
                <Phone className="w-3.5 h-3.5 text-[#9A3412] dark:text-[#F08A5D]" />
                {settings.prasadamPhone}
              </a>
            </div>
          ) : activeTab === 'booking' ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#3B3026] dark:text-[#DDD3C7]">
              <span className="font-semibold text-[#9A3412] dark:text-[#F08A5D]">Booking Coordinator:</span>
              <span>
                {settings.bookingCoordinator}{' '}
                <a
                  href={`tel:${settings.bookingPhone.replace(/[^0-9]/g, '')}`}
                  className="font-semibold underline underline-offset-4 tabular-nums"
                >
                  {settings.bookingPhone}
                </a>
              </span>
              <span className="text-[#665B51] dark:text-[#A99C8E]">
                *For private bookings, the temple will remain closed to the general public. Minimum rental is 2 hours.
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#4E443B] dark:text-[#CFC4B7]">
              <span>
                For Religious Puja:{' '}
                <strong className="text-[#1C1714] dark:text-[#F6F1EA]">{settings.priestName}</strong> ·{' '}
                <a
                  href={`tel:${settings.priestPhone.replace(/[^0-9]/g, '')}`}
                  className="text-[#9A3412] dark:text-[#F08A5D] font-semibold underline underline-offset-4 tabular-nums"
                >
                  {settings.priestPhone}
                </a>
              </span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span>Prasadam: {settings.prasadamPhone}</span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span>Bookings: {settings.bookingPhone}</span>
            </div>
          )}
        </div>
      </section>

      {/* Filter Bar & View Mode Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {tabs.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`min-h-[42px] px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#9A3412] dark:bg-[#B4411B] text-white'
                      : 'bg-[#EFE9DF] dark:bg-[#221C18] text-[#4E443B] dark:text-[#CFC4B7] hover:bg-[#E5DDD0] dark:hover:bg-[#2D2520] hover:text-[#1C1714] dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center p-1 bg-[#EFE9DF] dark:bg-[#221C18] rounded-lg self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-[#322924] text-[#1C1714] dark:text-[#F6F1EA] shadow-xs'
                  : 'text-[#5E5247] dark:text-[#A99C8E]'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Month View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('agenda')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'agenda'
                  ? 'bg-white dark:bg-[#322924] text-[#1C1714] dark:text-[#F6F1EA] shadow-xs'
                  : 'text-[#5E5247] dark:text-[#A99C8E]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Full 2026 List ({filteredEvents.length})
            </button>
          </div>
        </div>

        {viewMode === 'month' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Month Grid */}
            <div className="lg:col-span-7 bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E5DDD0] dark:border-[#2F2722] flex items-center justify-between gap-2">
                <h2 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">{monthLabel}</h2>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentYear(2026);
                      setCurrentMonth(10);
                      setSelectedDayIso('2026-11-24');
                    }}
                    className="min-h-[40px] px-3 py-1.5 rounded-lg border border-[#DCD2C3] dark:border-[#3A302A] text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] hover:border-[#9A3412] dark:hover:border-[#F08A5D] hover:text-[#9A3412] dark:hover:text-[#F08A5D] cursor-pointer whitespace-nowrap"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={prevMonth}
                    aria-label="Previous month"
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg border border-[#DCD2C3] dark:border-[#3A302A] text-[#1C1714] dark:text-[#F6F1EA] hover:bg-[#FAF8F4] dark:hover:bg-[#251F1B] cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextMonth}
                    aria-label="Next month"
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg border border-[#DCD2C3] dark:border-[#3A302A] text-[#1C1714] dark:text-[#F6F1EA] hover:bg-[#FAF8F4] dark:hover:bg-[#251F1B] cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 border-b border-[#EDE6DA] dark:border-[#2F2722] bg-[#FAF8F4] dark:bg-[#161210]">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-[#7D6E5D] dark:text-[#A99C8E]"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {calendarCells.map((cell, idx) => {
                  if (!cell) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="min-h-[60px] sm:min-h-[76px] border-b border-r border-[#F0EAE0] dark:border-[#28211C] bg-[#FCFBF9] dark:bg-[#15110F]"
                      />
                    );
                  }
                  const dayEvents = eventsByDate.get(cell.iso) || [];
                  const isSelected = selectedDayIso === cell.iso;
                  const isToday = cell.iso === '2026-11-24';

                  return (
                    <button
                      key={cell.iso}
                      type="button"
                      onClick={() => setSelectedDayIso(isSelected ? null : cell.iso)}
                      className={`min-h-[60px] sm:min-h-[76px] p-1.5 sm:p-2 border-b border-r border-[#F0EAE0] dark:border-[#28211C] flex flex-col items-start justify-between text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#9A3412]/10 dark:bg-[#F08A5D]/15 ring-2 ring-inset ring-[#9A3412] dark:ring-[#F08A5D]'
                          : dayEvents.length > 0
                            ? 'bg-white dark:bg-[#1C1714] hover:bg-[#FAF8F4] dark:hover:bg-[#251F1B]'
                            : 'bg-white dark:bg-[#1C1714] hover:bg-[#FAF8F4]/70 dark:hover:bg-[#221C18]'
                      }`}
                    >
                      <span
                        className={`text-xs sm:text-sm tabular-nums font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                          isToday
                            ? 'bg-[#9A3412] dark:bg-[#B4411B] text-white font-semibold'
                            : isSelected
                              ? 'text-[#9A3412] dark:text-[#F08A5D] font-bold'
                              : 'text-[#3B3026] dark:text-[#DDD3C7]'
                        }`}
                      >
                        {cell.day}
                      </span>

                      {dayEvents.length > 0 && (
                        <div className="w-full space-y-0.5 mt-1">
                          <span className="hidden sm:block text-[10px] font-semibold text-[#9A3412] dark:text-[#F08A5D] truncate leading-tight">
                            {dayEvents[0].title}
                          </span>
                          <div className="flex items-center gap-1 sm:hidden">
                            <span className="text-[10px] font-semibold text-[#9A3412] dark:text-[#F08A5D] tabular-nums">
                              {dayEvents.length} evt
                            </span>
                          </div>
                          {dayEvents.length > 1 && (
                            <span className="hidden sm:block text-[10px] text-[#7D6E5D] dark:text-[#A99C8E] tabular-nums">
                              +{dayEvents.length - 1} more
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Day / Selected Month Details Panel */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#7D6E5D] dark:text-[#A99C8E]">
                    {selectedDayIso ? 'Selected Date' : `All Events in ${monthLabel}`}
                  </p>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-0.5">
                    {selectedDayIso ? formatDateLong(selectedDayIso) : `${monthEvents.length} Scheduled Items`}
                  </h3>
                </div>
                {selectedDayIso && (
                  <button
                    type="button"
                    onClick={() => setSelectedDayIso(null)}
                    className="text-xs font-semibold text-[#9A3412] dark:text-[#F08A5D] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Show entire month
                  </button>
                )}
              </div>

              {(selectedDayIso ? selectedDayEvents : monthEvents).length === 0 ? (
                <div className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 text-sm text-[#665B51] dark:text-[#BFB5A8] space-y-2">
                  <p className="font-semibold text-[#1C1714] dark:text-[#F6F1EA]">No special events listed for this date.</p>
                  <p>
                    Regular temple timings: Sunday Satsang 10:30 AM – 1:00 PM · Monday & Tuesday 7:30 PM – 9:00 PM · Last Sunday Havan 9:30 AM – 11:00 AM.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(selectedDayIso ? selectedDayEvents : monthEvents).map((evt) => (
                    <article
                      key={evt.id}
                      className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-5 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs text-[#7D6E5D] dark:text-[#A99C8E] tabular-nums">
                        <span className="font-semibold text-[#9A3412] dark:text-[#F08A5D]">
                          {CATEGORY_LABELS[evt.category]}
                        </span>
                        <span>{evt.status || 'Confirmed'}</span>
                      </div>
                      <h4 className="font-serif text-xl font-bold text-[#1C1714] dark:text-[#F6F1EA] leading-snug">
                        {evt.title}
                      </h4>
                      <p className="text-xs font-semibold text-[#3B3026] dark:text-[#E4DBD0] tabular-nums">
                        {formatDateLong(evt.date)} · {evt.time}
                      </p>
                      {evt.fallsOnLabel && (
                        <p className="text-xs text-[#665B51] dark:text-[#BFB5A8]">
                          Falls on: {evt.fallsOnLabel}
                          {evt.celebratedOnLabel ? ` · Celebrated: ${evt.celebratedOnLabel}` : ''}
                        </p>
                      )}
                      <p className="text-xs sm:text-sm text-[#544A41] dark:text-[#CFC4B7] leading-relaxed">
                        {evt.description}
                      </p>
                      {evt.coordinator && (
                        <p className="text-xs text-[#7D6E5D] dark:text-[#A99C8E] pt-1">Coordinator: {evt.coordinator}</p>
                      )}
                      <div className="pt-2 border-t border-[#F0EAE0] dark:border-[#2A231E] flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => downloadEventIcs(evt)}
                          className="min-h-[40px] px-3.5 py-2 rounded-lg bg-[#F2EDE4] dark:bg-[#251F1B] hover:bg-[#E5DDD0] dark:hover:bg-[#322924] text-xs font-semibold text-[#1C1714] dark:text-[#F6F1EA] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <CalendarPlus className="w-3.5 h-3.5 text-[#9A3412] dark:text-[#F08A5D]" />
                          Add to iPhone / Android Calendar
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Authentic Astronomical Notes from 2026 Calendar Sheet */}
              <div className="bg-[#F2EDE4] dark:bg-[#191411] border border-[#E2D8C9] dark:border-[#2F2722] rounded-2xl p-5 text-xs text-[#4E443B] dark:text-[#CFC4B7] space-y-1.5 leading-relaxed">
                <p className="font-semibold text-[#1C1714] dark:text-[#F6F1EA]">2026 Astronomical & Panchang Notes (CST Regina)</p>
                <p>Solar Eclipse: Feb 17, 2026 and Aug 12, 2026 · Lunar Eclipse: Mar 3, 2026 and Aug 27, 2026.</p>
                <p>Adhik Maas 2026: Sunday, May 17 – Monday, June 14 (observed once every 3 years).</p>
                <p>Dates are calculated for CST Regina, SK and may differ from India. Celebration dates are subject to change.</p>
              </div>
            </div>
          </div>
        ) : (
          /* Chronological Full-Year Table / Mobile Card List */
          <div className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#F2EDE4] dark:bg-[#191411] border-b border-[#E5DDD0] dark:border-[#2F2722] text-xs font-semibold uppercase tracking-wider text-[#665B51] dark:text-[#A99C8E]">
              <div className="col-span-3">Date & Timing</div>
              <div className="col-span-4">Event / Festival</div>
              <div className="col-span-3">Category & Status</div>
              <div className="col-span-2 text-right">Save Date</div>
            </div>

            <div className="divide-y divide-[#EDE6DA] dark:divide-[#2A231E]">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-5 md:px-6 md:py-4 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center"
                >
                  <div className="md:col-span-3 tabular-nums">
                    <div className="text-sm font-semibold text-[#1C1714] dark:text-[#F6F1EA]">
                      {new Date(`${evt.date}T12:00:00`).toLocaleDateString('en-CA', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-xs text-[#665B51] dark:text-[#A99C8E] mt-0.5">{evt.time}</div>
                  </div>

                  <div className="md:col-span-4">
                    <div className="font-serif text-lg sm:text-xl font-bold text-[#1C1714] dark:text-[#F6F1EA] leading-snug">
                      {evt.title}
                    </div>
                    <p className="text-xs text-[#5E5247] dark:text-[#BFB5A8] mt-1 leading-relaxed">{evt.description}</p>
                  </div>

                  <div className="md:col-span-3 text-xs space-y-0.5">
                    <div className="font-semibold text-[#9A3412] dark:text-[#F08A5D]">{CATEGORY_LABELS[evt.category]}</div>
                    <div className="text-[#5E5247] dark:text-[#CFC4B7]">{evt.status || 'Confirmed'}</div>
                    {evt.fallsOnLabel && (
                      <div className="text-[#7D6E5D] dark:text-[#A99C8E]">Falls on: {evt.fallsOnLabel}</div>
                    )}
                  </div>

                  <div className="md:col-span-2 flex md:justify-end">
                    <button
                      type="button"
                      onClick={() => downloadEventIcs(evt)}
                      className="min-h-[40px] px-3.5 py-2 rounded-lg border border-[#D4C7B5] dark:border-[#3A302A] hover:border-[#9A3412] dark:hover:border-[#F08A5D] text-xs font-medium text-[#1C1714] dark:text-[#F6F1EA] hover:text-[#9A3412] dark:hover:text-[#F08A5D] inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      Save .ics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Official 2026 Festivals Poster Lightbox */}
      {showPoster && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowPoster(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#322924] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-[#E5DDD0] dark:border-[#2F2722] flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                Official 2026 Festivals Calendar (Vikram Samvat 2080–2081)
              </h3>
              <button
                type="button"
                onClick={() => setShowPoster(false)}
                aria-label="Close festival sheet"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#1C1714] dark:text-[#F6F1EA] hover:bg-[#FAF8F4] dark:hover:bg-[#2A231E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto p-4 bg-[#FAF8F4] dark:bg-[#120F0D]">
              <SafeImage
                src="./images/temple/23_festival-list-2023_d607b540.jpg"
                alt="Official 2026 Festivals Calendar for Regina Hindu Temple"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
