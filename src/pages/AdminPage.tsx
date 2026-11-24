import React, { useRef, useState } from 'react';
import {
  Calendar,
  Check,
  Clock,
  Database,
  Download,
  Edit3,
  Eye,
  EyeOff,
  Images,
  Inbox,
  LayoutDashboard,
  Lock,
  Newspaper,
  Pin,
  Plus,
  RotateCcw,
  Save,
  Settings,
  Star,
  Trash2,
  Unlock,
  Upload,
  Users,
} from 'lucide-react';
import {
  BoardMember,
  CalendarCategory,
  CalendarEvent,
  GalleryAlbum,
  GalleryPhoto,
  NewsItem,
  RouteKey,
  ScheduleSlot,
} from '../types/temple';
import { useTempleData } from '../context/TempleDataContext';
import { SafeImage } from '../components/SafeImage';

type AdminTab =
  | 'overview'
  | 'calendar'
  | 'gallery'
  | 'news'
  | 'schedule'
  | 'directory'
  | 'inbox'
  | 'backup';

interface AdminPageProps {
  onNavigate: (route: RouteKey) => void;
}

const ALBUMS: GalleryAlbum[] = [
  'Sanctum & Deities',
  'Rath Yatra 2025',
  'Temple Heritage (1989–1993)',
  'Architecture & Bells',
  'Community & Notices',
];

const INPUT_CLASS =
  'w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FAF8F4] dark:bg-[#14110F] border border-[#DCD2C3] dark:border-[#3A302A] text-sm text-[#1C1714] dark:text-[#F6F1EA] placeholder:text-[#8B7E70] focus:outline-none focus:border-[#9A3412] dark:focus:border-[#F08A5D]';

const TEXTAREA_CLASS =
  'w-full px-3.5 py-2 rounded-xl bg-[#FAF8F4] dark:bg-[#14110F] border border-[#DCD2C3] dark:border-[#3A302A] text-sm text-[#1C1714] dark:text-[#F6F1EA] placeholder:text-[#8B7E70] focus:outline-none focus:border-[#9A3412] dark:focus:border-[#F08A5D]';

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const {
    data,
    updateSettings,
    addEvent,
    updateEvent,
    deleteEvent,
    addPhoto,
    updatePhoto,
    deletePhoto,
    addNews,
    updateNews,
    deleteNews,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    addBoardMember,
    deleteBoardMember,
    addBereavementMember,
    deleteBereavementMember,
    toggleInquiryStatus,
    deleteInquiry,
    deleteSubscriber,
    exportJson,
    importJson,
    resetToDefaults,
  } = useTempleData();

  const [unlocked, setUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('rht_admin_unlocked') === '1';
    } catch {
      return false;
    }
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  // --- Calendar Form State ---
  const [calFilter, setCalFilter] = useState<'all' | CalendarCategory>('all');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [evtForm, setEvtForm] = useState<Omit<CalendarEvent, 'id'>>({
    title: '',
    date: '2026-12-06',
    time: '10:30 AM – 1:00 PM',
    category: 'festival',
    description: '',
    coordinator: '',
    status: 'Confirmed',
    featured: false,
  });

  // --- Gallery Form State ---
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [photoForm, setPhotoForm] = useState<Omit<GalleryPhoto, 'id'>>({
    title: '',
    caption: '',
    album: 'Sanctum & Deities',
    year: '2026',
    src: '',
    featured: false,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- News Form State ---
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState<Omit<NewsItem, 'id'>>({
    title: '',
    summary: '',
    body: '',
    date: '2026-11-24',
    category: 'Festival Notice',
    pinned: false,
    published: true,
  });

  // --- Schedule Form State ---
  const [editingSchedId, setEditingSchedId] = useState<string | null>(null);
  const [schedForm, setSchedForm] = useState<Omit<ScheduleSlot, 'id'>>({
    title: '',
    timing: '',
    frequency: '',
    note: '',
  });

  // --- Directory Form State ---
  const [boardForm, setBoardForm] = useState<Omit<BoardMember, 'id'>>({
    role: '',
    name: '',
    phone: '',
    group: 'Coordinators',
  });
  const [berName, setBerName] = useState('');
  const [berPhone, setBerPhone] = useState('');

  // --- Settings Draft State ---
  const [settingsDraft, setSettingsDraft] = useState(data.settings);

  // --- Backup / Reset State ---
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === '1987' || passcode.trim().toLowerCase() === 'admin') {
      setUnlocked(true);
      setAuthError('');
      try {
        sessionStorage.setItem('rht_admin_unlocked', '1');
      } catch {
        // ignore
      }
    } else {
      setAuthError('Incorrect passcode. Use 1987 (founding year) or click Demo Admin Access below.');
    }
  };

  const enterDemo = () => {
    setUnlocked(true);
    setAuthError('');
    try {
      sessionStorage.setItem('rht_admin_unlocked', '1');
    } catch {
      // ignore
    }
  };

  const handleLock = () => {
    setUnlocked(false);
    setPasscode('');
    try {
      sessionStorage.removeItem('rht_admin_unlocked');
    } catch {
      // ignore
    }
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtForm.title.trim() || !evtForm.date) return;
    if (editingEventId) {
      updateEvent(editingEventId, evtForm);
      notify('Calendar event updated.');
      setEditingEventId(null);
    } else {
      addEvent(evtForm);
      notify('New event added to live calendar.');
    }
    setEvtForm({
      title: '',
      date: '2026-12-06',
      time: '10:30 AM – 1:00 PM',
      category: 'festival',
      description: '',
      coordinator: '',
      status: 'Confirmed',
      featured: false,
    });
  };

  const startEditEvent = (evt: CalendarEvent) => {
    setEditingEventId(evt.id);
    setEvtForm({
      title: evt.title,
      date: evt.date,
      time: evt.time,
      category: evt.category,
      description: evt.description,
      coordinator: evt.coordinator || '',
      status: evt.status || 'Confirmed',
      featured: Boolean(evt.featured),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoForm((prev) => ({
          ...prev,
          src: reader.result as string,
          title: prev.title || file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '),
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.title.trim() || !photoForm.src.trim()) return;
    if (editingPhotoId) {
      updatePhoto(editingPhotoId, photoForm);
      notify('Gallery photograph updated.');
      setEditingPhotoId(null);
    } else {
      addPhoto(photoForm);
      notify('Photograph published to Full Gallery.');
    }
    setPhotoForm({
      title: '',
      caption: '',
      album: 'Sanctum & Deities',
      year: '2026',
      src: '',
      featured: false,
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startEditPhoto = (photo: GalleryPhoto) => {
    setEditingPhotoId(photo.id);
    setPhotoForm({
      title: photo.title,
      caption: photo.caption,
      album: photo.album,
      year: photo.year,
      src: photo.src,
      featured: Boolean(photo.featured),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title.trim() || !newsForm.summary.trim()) return;
    if (editingNewsId) {
      updateNews(editingNewsId, newsForm);
      notify('Announcement updated.');
      setEditingNewsId(null);
    } else {
      addNews(newsForm);
      notify('News announcement published.');
    }
    setNewsForm({
      title: '',
      summary: '',
      body: '',
      date: '2026-11-24',
      category: 'Festival Notice',
      pinned: false,
      published: true,
    });
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedForm.title.trim() || !schedForm.timing.trim()) return;
    if (editingSchedId) {
      updateSchedule(editingSchedId, schedForm);
      notify('Weekly timing updated.');
      setEditingSchedId(null);
    } else {
      addSchedule(schedForm);
      notify('Weekly timing added.');
    }
    setSchedForm({ title: '', timing: '', frequency: '', note: '' });
  };

  const handleDownloadJson = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `regina-hindu-temple-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Backup JSON downloaded.');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = importJson(String(reader.result || ''));
      if (res.ok) {
        setImportStatus('Temple site data restored successfully from JSON backup.');
        notify('Site data imported.');
      } else {
        setImportStatus(res.error || 'Import failed.');
      }
    };
    reader.readAsText(file);
  };

  // --- Passcode Gate ---
  if (!unlocked) {
    return (
      <div className="min-h-[78vh] bg-[#FAF8F4] dark:bg-[#120F0D] flex items-center justify-center px-4 py-12 transition-colors duration-200">
        <div className="w-full max-w-md bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-3xl p-7 sm:p-9 space-y-6 shadow-xs">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#F2EDE4] dark:bg-[#251F1B] border border-[#E5DDD0] dark:border-[#3A302A] text-[#9A3412] dark:text-[#F08A5D] flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#7D6E5D] dark:text-[#A99C8E]">
              Temple Committee CMS
            </p>
            <h1 className="font-serif text-3xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
              Admin Management Panel
            </h1>
            <p className="text-sm text-[#5E5247] dark:text-[#CFC4B7] leading-relaxed">
              Manage the 2026 Calendar, Photo Gallery, Temple News, Weekly Timings, Board Contacts, and Devotee Inquiries.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label htmlFor="admin-pass" className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1.5">
                Committee Passcode (Demo code: 1987)
              </label>
              <input
                id="admin-pass"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter 1987"
                className={INPUT_CLASS}
              />
              {authError && <p className="text-xs text-[#9A3412] dark:text-[#F08A5D] mt-1.5">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#9A3412] dark:bg-[#B4411B] text-white text-sm font-semibold hover:bg-[#7C2D12] dark:hover:bg-[#C74B21] transition-colors cursor-pointer"
            >
              Sign In to Admin Panel
            </button>
          </form>

          <div className="pt-4 border-t border-[#EDE6DA] dark:border-[#2F2722] text-center">
            <button
              type="button"
              onClick={enterDemo}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#D4C7B5] dark:border-[#3A302A] bg-[#FAF8F4] dark:bg-[#14110F] text-sm font-medium text-[#1C1714] dark:text-[#F6F1EA] hover:border-[#9A3412] dark:hover:border-[#F08A5D] hover:text-[#9A3412] dark:hover:text-[#F08A5D] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              One-Tap Demo Admin Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems: { key: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'calendar', label: 'Calendar & Events', icon: Calendar, count: data.events.length },
    { key: 'gallery', label: 'Photo Gallery', icon: Images, count: data.gallery.length },
    { key: 'news', label: 'News & Notices', icon: Newspaper, count: data.news.length },
    { key: 'schedule', label: 'Timings & Settings', icon: Settings },
    { key: 'directory', label: 'Board & Contacts', icon: Users, count: data.board.length },
    {
      key: 'inbox',
      label: 'Inbox & Subscribers',
      icon: Inbox,
      count: data.inquiries.filter((i) => i.status === 'New').length,
    },
    { key: 'backup', label: 'Backup & GitHub', icon: Database },
  ];

  const newInquiriesCount = data.inquiries.filter((i) => i.status === 'New').length;

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#120F0D] transition-colors duration-200">
      {/* Admin Top Banner */}
      <section className="bg-[#1C1714] dark:bg-[#0D0A08] text-white border-b border-[#322A24] dark:border-[#26201C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#E6C594]">
              Live Content Management Studio
            </p>
            <h1 className="font-serif text-3xl font-bold text-white mt-0.5">
              Regina Hindu Temple Admin Panel
            </h1>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="min-h-[40px] px-4 py-2 rounded-lg bg-white/12 hover:bg-white/20 text-xs font-medium text-white cursor-pointer whitespace-nowrap"
            >
              Preview Live Website
            </button>
            <button
              type="button"
              onClick={handleLock}
              className="min-h-[40px] px-3.5 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-xs font-medium text-[#E4DBD0] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Lock className="w-3.5 h-3.5" />
              Lock
            </button>
          </div>
        </div>
      </section>

      {/* Live Save Toast */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-[#1C1714] dark:bg-[#2C2420] text-white px-4 py-3 rounded-xl shadow-xl border border-[#3B3026] dark:border-[#4A3D35] text-xs sm:text-sm font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-[#E6C594]" />
          {toast}
        </div>
      )}

      {/* Mobile Horizontal Admin Tabs */}
      <div className="lg:hidden sticky top-13 z-30 bg-[#FAF8F4]/95 dark:bg-[#161210]/95 backdrop-blur-md border-b border-[#E5DDD0] dark:border-[#2F2722] px-4 py-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setActiveTab(item.key);
                if (item.key === 'schedule') setSettingsDraft(data.settings);
              }}
              className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#9A3412] dark:bg-[#B4411B] text-white'
                  : 'bg-[#EFE9DF] dark:bg-[#221C18] text-[#4E443B] dark:text-[#CFC4B7]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
              {item.count !== undefined && <span className="opacity-80 tabular-nums">({item.count})</span>}
            </button>
          );
        })}
      </div>

      {/* Main Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-3 sticky top-24 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveTab(item.key);
                  if (item.key === 'schedule') setSettingsDraft(data.settings);
                }}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#9A3412] dark:bg-[#B4411B] text-white'
                    : 'text-[#4E443B] dark:text-[#CFC4B7] hover:bg-[#FAF8F4] dark:hover:bg-[#251F1B] hover:text-[#1C1714] dark:hover:text-white'
                }`}
              >
                <span className="inline-flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </span>
                {item.count !== undefined && (
                  <span className={`text-xs tabular-nums ${active ? 'text-white/85' : 'text-[#857768] dark:text-[#A99C8E]'}`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Main Editor Workspace */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Calendar Events', value: data.events.length, tab: 'calendar' as AdminTab },
                  { label: 'Gallery Photos', value: data.gallery.length, tab: 'gallery' as AdminTab },
                  { label: 'News Bulletins', value: data.news.length, tab: 'news' as AdminTab },
                  { label: 'New Inquiries', value: newInquiriesCount, tab: 'inbox' as AdminTab },
                ].map((stat) => (
                  <button
                    key={stat.label}
                    type="button"
                    onClick={() => setActiveTab(stat.tab)}
                    className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] hover:border-[#9A3412] dark:hover:border-[#F08A5D] rounded-2xl p-5 text-left transition-colors cursor-pointer"
                  >
                    <p className="text-xs text-[#7D6E5D] dark:text-[#A99C8E]">{stat.label}</p>
                    <p className="font-serif text-4xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1 tabular-nums">
                      {stat.value}
                    </p>
                  </button>
                ))}
              </div>

              <div className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 space-y-4">
                <h2 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                  Quick Management Actions
                </h2>
                <p className="text-sm text-[#544A41] dark:text-[#CFC4B7] leading-relaxed">
                  Every change you make here updates the live website immediately and persists in your browser. When deploying updates permanently to GitHub Pages, export your JSON backup from the Backup & GitHub tab.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  {[
                    { label: 'Add Festival or Booking', tab: 'calendar' as AdminTab },
                    { label: 'Upload Gallery Photo', tab: 'gallery' as AdminTab },
                    { label: 'Post Temple News', tab: 'news' as AdminTab },
                    { label: 'Edit Weekly Timings', tab: 'schedule' as AdminTab },
                    { label: 'Update Board Contacts', tab: 'directory' as AdminTab },
                    { label: 'Review Devotee Inbox', tab: 'inbox' as AdminTab },
                  ].map((act) => (
                    <button
                      key={act.label}
                      type="button"
                      onClick={() => setActiveTab(act.tab)}
                      className="min-h-[44px] px-4 py-3 rounded-xl bg-[#FAF8F4] dark:bg-[#14110F] border border-[#E2D8C9] dark:border-[#322924] hover:border-[#9A3412] dark:hover:border-[#F08A5D] text-sm font-medium text-[#1C1714] dark:text-[#F6F1EA] text-left flex items-center justify-between cursor-pointer"
                    >
                      {act.label}
                      <Plus className="w-4 h-4 text-[#9A3412] dark:text-[#F08A5D]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CALENDAR & EVENTS MANAGER */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <form
                onSubmit={handleSaveEvent}
                className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                    {editingEventId ? 'Edit Calendar Event' : 'Add Calendar Event / Festival / Booking'}
                  </h2>
                  {editingEventId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEventId(null);
                        setEvtForm({
                          title: '',
                          date: '2026-12-06',
                          time: '10:30 AM – 1:00 PM',
                          category: 'festival',
                          description: '',
                          coordinator: '',
                          status: 'Confirmed',
                          featured: false,
                        });
                      }}
                      className="text-xs font-semibold text-[#9A3412] dark:text-[#F08A5D] hover:underline cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={evtForm.title}
                      onChange={(e) => setEvtForm({ ...evtForm, title: e.target.value })}
                      placeholder="e.g. Maha Shivratri or Sunday Prasadam"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Calendar Category</label>
                    <select
                      value={evtForm.category}
                      onChange={(e) => setEvtForm({ ...evtForm, category: e.target.value as CalendarCategory })}
                      className={INPUT_CLASS}
                    >
                      <option value="festival">2026 Festivals</option>
                      <option value="hours">Temple Hours</option>
                      <option value="prasadam">Prasadam Calendar</option>
                      <option value="booking">Booking Calendar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={evtForm.date}
                      onChange={(e) => setEvtForm({ ...evtForm, date: e.target.value })}
                      className={`${INPUT_CLASS} tabular-nums`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Timing *</label>
                    <input
                      type="text"
                      required
                      value={evtForm.time}
                      onChange={(e) => setEvtForm({ ...evtForm, time: e.target.value })}
                      placeholder="10:30 AM – 1:00 PM"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Status</label>
                    <select
                      value={evtForm.status}
                      onChange={(e) =>
                        setEvtForm({ ...evtForm, status: e.target.value as CalendarEvent['status'] })
                      }
                      className={INPUT_CLASS}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Available to Sponsor">Available to Sponsor</option>
                      <option value="Sponsored">Sponsored</option>
                      <option value="Private Booking (Closed to Public)">Private Booking (Closed to Public)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Coordinator (Optional)</label>
                    <input
                      type="text"
                      value={evtForm.coordinator || ''}
                      onChange={(e) => setEvtForm({ ...evtForm, coordinator: e.target.value })}
                      placeholder="e.g. Pt. Dharmesh Dave · (306) 450-2429"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={evtForm.description}
                    onChange={(e) => setEvtForm({ ...evtForm, description: e.target.value })}
                    placeholder="Details about ceremony, Prasadam, or booking notes..."
                    className={TEXTAREA_CLASS}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(evtForm.featured)}
                      onChange={(e) => setEvtForm({ ...evtForm, featured: e.target.checked })}
                      className="w-4 h-4 accent-[#9A3412]"
                    />
                    Feature on Home Upcoming Dates
                  </label>

                  <button
                    type="submit"
                    className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#9A3412] dark:bg-[#B4411B] text-white text-sm font-semibold hover:bg-[#7C2D12] dark:hover:bg-[#C74B21] inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {editingEventId ? 'Update Event' : 'Add to Calendar'}
                  </button>
                </div>
              </form>

              <div className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E5DDD0] dark:border-[#2F2722] flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-serif text-xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                    All Calendar Entries ({data.events.filter((e) => calFilter === 'all' || e.category === calFilter).length})
                  </h3>
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {(['all', 'festival', 'hours', 'prasadam', 'booking'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCalFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize cursor-pointer ${
                          calFilter === cat
                            ? 'bg-[#1C1714] dark:bg-[#F6F1EA] text-white dark:text-[#1C1714]'
                            : 'bg-[#EFE9DF] dark:bg-[#251F1B] text-[#4E443B] dark:text-[#CFC4B7]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-[#EDE6DA] dark:divide-[#2A231E] max-h-[540px] overflow-y-auto">
                  {data.events
                    .filter((e) => calFilter === 'all' || e.category === calFilter)
                    .map((evt) => (
                      <div key={evt.id} className="p-4 sm:px-5 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs text-[#9A3412] dark:text-[#F08A5D] font-semibold capitalize tabular-nums">
                            {evt.category} · {evt.date} · {evt.time}
                          </p>
                          <p className="font-semibold text-sm text-[#1C1714] dark:text-[#F6F1EA] truncate">
                            {evt.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditEvent(evt)}
                            aria-label={`Edit ${evt.title}`}
                            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg border border-[#E5DDD0] dark:border-[#3A302A] text-[#4E443B] dark:text-[#CFC4B7] hover:text-[#9A3412] dark:hover:text-[#F08A5D] hover:border-[#9A3412] cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              deleteEvent(evt.id);
                              notify('Event deleted.');
                            }}
                            aria-label={`Delete ${evt.title}`}
                            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg border border-[#E5DDD0] dark:border-[#3A302A] text-[#7D6E5D] dark:text-[#A99C8E] hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GALLERY MANAGER */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <form
                onSubmit={handleSavePhoto}
                className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                    {editingPhotoId ? 'Edit Gallery Photo' : 'Add Photograph to Gallery'}
                  </h2>
                  {editingPhotoId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPhotoId(null);
                        setPhotoForm({
                          title: '',
                          caption: '',
                          album: 'Sanctum & Deities',
                          year: '2026',
                          src: '',
                          featured: false,
                        });
                      }}
                      className="text-xs font-semibold text-[#9A3412] dark:text-[#F08A5D] hover:underline cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Photo Title *</label>
                    <input
                      type="text"
                      required
                      value={photoForm.title}
                      onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                      placeholder="e.g. Diwali 2026 Maha Aarti"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Album</label>
                      <select
                        value={photoForm.album}
                        onChange={(e) =>
                          setPhotoForm({ ...photoForm, album: e.target.value as GalleryAlbum })
                        }
                        className={INPUT_CLASS}
                      >
                        {ALBUMS.map((alb) => (
                          <option key={alb} value={alb}>
                            {alb}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Year</label>
                      <input
                        type="text"
                        value={photoForm.year}
                        onChange={(e) => setPhotoForm({ ...photoForm, year: e.target.value })}
                        placeholder="2026"
                        className={`${INPUT_CLASS} tabular-nums`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">
                      Upload from iPhone / Android / Computer
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="block w-full text-xs text-[#544A41] dark:text-[#CFC4B7] file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#EFE9DF] dark:file:bg-[#251F1B] file:text-[#1C1714] dark:file:text-[#F6F1EA] hover:file:bg-[#E2D8C9] cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">
                      Or Image Path / URL *
                    </label>
                    <input
                      type="text"
                      required
                      value={photoForm.src}
                      onChange={(e) => setPhotoForm({ ...photoForm, src: e.target.value })}
                      placeholder="./images/temple/01_home_1596a445.jpg"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                {photoForm.src && (
                  <div className="w-40 h-28 rounded-xl overflow-hidden border border-[#E5DDD0] dark:border-[#322924] bg-[#EFE9DF] dark:bg-[#251F1B]">
                    <SafeImage src={photoForm.src} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Caption / Story</label>
                  <textarea
                    rows={2}
                    value={photoForm.caption}
                    onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                    placeholder="Describe this temple moment or festival memory..."
                    className={TEXTAREA_CLASS}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(photoForm.featured)}
                      onChange={(e) => setPhotoForm({ ...photoForm, featured: e.target.checked })}
                      className="w-4 h-4 accent-[#9A3412]"
                    />
                    Highlight on Home Page
                  </label>
                  <button
                    type="submit"
                    className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#9A3412] dark:bg-[#B4411B] text-white text-sm font-semibold hover:bg-[#7C2D12] dark:hover:bg-[#C74B21] inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    {editingPhotoId ? 'Save Changes' : 'Publish Photo'}
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.gallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[16/10] bg-[#EFE9DF] dark:bg-[#251F1B] overflow-hidden">
                      <SafeImage src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        <p className="text-[11px] text-[#9A3412] dark:text-[#F08A5D] font-semibold">
                          {photo.album} · {photo.year}
                        </p>
                        <p className="font-semibold text-sm text-[#1C1714] dark:text-[#F6F1EA] mt-0.5 line-clamp-1">
                          {photo.title}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F0EAE0] dark:border-[#2A231E]">
                        <button
                          type="button"
                          onClick={() => updatePhoto(photo.id, { featured: !photo.featured })}
                          className={`min-h-[36px] px-2.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 cursor-pointer ${
                            photo.featured
                              ? 'bg-[#9A3412]/10 dark:bg-[#F08A5D]/15 text-[#9A3412] dark:text-[#F08A5D]'
                              : 'text-[#665B51] dark:text-[#A99C8E] hover:bg-[#FAF8F4] dark:hover:bg-[#251F1B]'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5" />
                          {photo.featured ? 'Featured' : 'Feature'}
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEditPhoto(photo)}
                            aria-label={`Edit ${photo.title}`}
                            className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg border border-[#E5DDD0] dark:border-[#3A302A] text-[#4E443B] dark:text-[#CFC4B7] hover:text-[#9A3412] dark:hover:text-[#F08A5D] cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              deletePhoto(photo.id);
                              notify('Photograph removed.');
                            }}
                            aria-label={`Delete ${photo.title}`}
                            className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg border border-[#E5DDD0] dark:border-[#3A302A] text-[#7D6E5D] dark:text-[#A99C8E] hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: NEWS & ANNOUNCEMENTS MANAGER */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              <div className="bg-[#F2EDE4] dark:bg-[#191411] border border-[#E2D8C9] dark:border-[#2F2722] rounded-2xl p-5 space-y-2.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A3412] dark:text-[#F08A5D]">
                  Live Top Announcement Bar (Visible across Home)
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={data.settings.tickerNotice}
                    onChange={(e) => updateSettings({ tickerNotice: e.target.value })}
                    className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C1714] border border-[#DCD2C3] dark:border-[#3A302A] text-sm text-[#1C1714] dark:text-[#F6F1EA]"
                  />
                  <button
                    type="button"
                    onClick={() => notify('Top announcement ribbon updated live.')}
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-[#1C1714] dark:bg-[#F6F1EA] text-white dark:text-[#1C1714] text-xs font-semibold cursor-pointer whitespace-nowrap"
                  >
                    Save Ribbon
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleSaveNews}
                className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 space-y-4"
              >
                <h2 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                  {editingNewsId ? 'Edit News Announcement' : 'Publish News / Temple Bulletin'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Headline *</label>
                    <input
                      type="text"
                      required
                      value={newsForm.title}
                      onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                      placeholder="e.g. Special New Year Havan Announcement"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Category</label>
                    <select
                      value={newsForm.category}
                      onChange={(e) =>
                        setNewsForm({ ...newsForm, category: e.target.value as NewsItem['category'] })
                      }
                      className={INPUT_CLASS}
                    >
                      <option value="Festival Notice">Festival Notice</option>
                      <option value="Community Update">Community Update</option>
                      <option value="Vidyalaya">Vidyalaya</option>
                      <option value="Seva & Appeal">Seva & Appeal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Short Summary *</label>
                    <input
                      type="text"
                      required
                      value={newsForm.summary}
                      onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                      placeholder="1-sentence overview shown on the Home page..."
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Date</label>
                    <input
                      type="date"
                      value={newsForm.date}
                      onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                      className={`${INPUT_CLASS} tabular-nums`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Full Announcement Body</label>
                  <textarea
                    rows={3}
                    value={newsForm.body}
                    onChange={(e) => setNewsForm({ ...newsForm, body: e.target.value })}
                    placeholder="Full details, timings, and coordinator contacts..."
                    className={TEXTAREA_CLASS}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(newsForm.pinned)}
                        onChange={(e) => setNewsForm({ ...newsForm, pinned: e.target.checked })}
                        className="w-4 h-4 accent-[#9A3412]"
                      />
                      Pin to top
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newsForm.published}
                        onChange={(e) => setNewsForm({ ...newsForm, published: e.target.checked })}
                        className="w-4 h-4 accent-[#9A3412]"
                      />
                      Published
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#9A3412] dark:bg-[#B4411B] text-white text-sm font-semibold hover:bg-[#7C2D12] dark:hover:bg-[#C74B21] inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {editingNewsId ? 'Update Bulletin' : 'Publish News'}
                  </button>
                </div>
              </form>

              <div className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl divide-y divide-[#EDE6DA] dark:divide-[#2A231E]">
                {data.news.map((item) => (
                  <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-[#7D6E5D] dark:text-[#A99C8E] tabular-nums">
                        <span className="font-semibold text-[#9A3412] dark:text-[#F08A5D]">{item.category}</span> · {item.date} ·{' '}
                        {item.published ? 'Visible on site' : 'Hidden draft'}
                      </div>
                      <h3 className="font-semibold text-base text-[#1C1714] dark:text-[#F6F1EA]">{item.title}</h3>
                      <p className="text-xs text-[#5E5247] dark:text-[#CFC4B7]">{item.summary}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateNews(item.id, { pinned: !item.pinned })}
                        title="Toggle Pin"
                        className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg border cursor-pointer ${
                          item.pinned
                            ? 'border-[#9A3412] dark:border-[#F08A5D] bg-[#9A3412]/10 dark:bg-[#F08A5D]/15 text-[#9A3412] dark:text-[#F08A5D]'
                            : 'border-[#E5DDD0] dark:border-[#3A302A] text-[#7D6E5D] dark:text-[#A99C8E]'
                        }`}
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateNews(item.id, { published: !item.published })}
                        title={item.published ? 'Hide Draft' : 'Publish'}
                        className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg border border-[#E5DDD0] dark:border-[#3A302A] text-[#4E443B] dark:text-[#CFC4B7] cursor-pointer"
                      >
                        {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNewsId(item.id);
                          setNewsForm({
                            title: item.title,
                            summary: item.summary,
                            body: item.body,
                            date: item.date,
                            category: item.category,
                            pinned: Boolean(item.pinned),
                            published: item.published,
                          });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg border border-[#E5DDD0] dark:border-[#3A302A] text-[#4E443B] dark:text-[#CFC4B7] hover:text-[#9A3412] dark:hover:text-[#F08A5D] cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteNews(item.id);
                          notify('News item deleted.');
                        }}
                        className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg border border-[#E5DDD0] dark:border-[#3A302A] text-[#7D6E5D] dark:text-[#A99C8E] hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: WEEKLY TIMINGS & SITE SETTINGS */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 space-y-5">
                <h2 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#9A3412] dark:text-[#F08A5D]" />
                  Weekly Temple Timings
                </h2>

                <form
                  onSubmit={handleSaveSchedule}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-5 border-b border-[#EDE6DA] dark:border-[#2F2722]"
                >
                  <input
                    type="text"
                    required
                    value={schedForm.title}
                    onChange={(e) => setSchedForm({ ...schedForm, title: e.target.value })}
                    placeholder="Program Title (e.g. Wednesday Bhajan)"
                    className={INPUT_CLASS}
                  />
                  <input
                    type="text"
                    required
                    value={schedForm.timing}
                    onChange={(e) => setSchedForm({ ...schedForm, timing: e.target.value })}
                    placeholder="Timing (e.g. 7:00 PM – 8:30 PM)"
                    className={INPUT_CLASS}
                  />
                  <input
                    type="text"
                    required
                    value={schedForm.frequency}
                    onChange={(e) => setSchedForm({ ...schedForm, frequency: e.target.value })}
                    placeholder="Frequency (e.g. Every Wednesday)"
                    className={INPUT_CLASS}
                  />
                  <input
                    type="text"
                    value={schedForm.note || ''}
                    onChange={(e) => setSchedForm({ ...schedForm, note: e.target.value })}
                    placeholder="Short note (optional)"
                    className={INPUT_CLASS}
                  />
                  <div className="sm:col-span-2 flex justify-end gap-2">
                    {editingSchedId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSchedId(null);
                          setSchedForm({ title: '', timing: '', frequency: '', note: '' });
                        }}
                        className="min-h-[42px] px-4 rounded-xl border border-[#D4C7B5] dark:border-[#3A302A] text-xs font-medium text-[#1C1714] dark:text-[#F6F1EA] cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="min-h-[42px] px-5 rounded-xl bg-[#9A3412] dark:bg-[#B4411B] text-white text-xs font-semibold cursor-pointer"
                    >
                      {editingSchedId ? 'Update Schedule' : 'Add Schedule Slot'}
                    </button>
                  </div>
                </form>

                <div className="divide-y divide-[#EDE6DA] dark:divide-[#2A231E]">
                  {data.schedules.map((slot) => (
                    <div key={slot.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#1C1714] dark:text-[#F6F1EA]">
                          {slot.title}{' '}
                          <span className="text-[#9A3412] dark:text-[#F08A5D] font-normal">· {slot.timing}</span>
                        </p>
                        <p className="text-xs text-[#665B51] dark:text-[#A99C8E]">
                          {slot.frequency}
                          {slot.note ? ` — ${slot.note}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSchedId(slot.id);
                            setSchedForm({
                              title: slot.title,
                              timing: slot.timing,
                              frequency: slot.frequency,
                              note: slot.note || '',
                            });
                          }}
                          className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg border border-[#E5DDD0] dark:border-[#3A302A] text-[#4E443B] dark:text-[#CFC4B7] cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteSchedule(slot.id);
                            notify('Schedule slot removed.');
                          }}
                          className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg border border-[#E5DDD0] dark:border-[#3A302A] text-[#7D6E5D] dark:text-[#A99C8E] hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateSettings(settingsDraft);
                  notify('Temple website settings saved.');
                }}
                className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 space-y-4"
              >
                <h2 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                  Temple Details, Contacts & Links
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'templeName', label: 'Temple Name' },
                    { key: 'templePhone', label: 'Temple Phone Line' },
                    { key: 'priestName', label: 'Priest Name' },
                    { key: 'priestPhone', label: 'Priest Phone' },
                    { key: 'interacEmail', label: 'Interac e-Transfer & Email' },
                    { key: 'address', label: 'Street Address' },
                    { key: 'prasadamCoordinator', label: 'Prasadam Coordinator' },
                    { key: 'prasadamPhone', label: 'Prasadam Phone' },
                    { key: 'bookingCoordinator', label: 'Booking Coordinator' },
                    { key: 'bookingPhone', label: 'Booking Phone' },
                    { key: 'rentalCoordinator', label: 'Rental Coordinator' },
                    { key: 'rentalPhone', label: 'Rental Phone' },
                    { key: 'membershipFormUrl', label: '2026 Membership Form URL' },
                    { key: 'vidyalayaFormUrl', label: 'Vidyalaya Registration URL' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={String(settingsDraft[field.key as keyof typeof settingsDraft] || '')}
                        onChange={(e) =>
                          setSettingsDraft({ ...settingsDraft, [field.key]: e.target.value })
                        }
                        className={INPUT_CLASS}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Hero Headline</label>
                  <input
                    type="text"
                    value={settingsDraft.heroTitle}
                    onChange={(e) => setSettingsDraft({ ...settingsDraft, heroTitle: e.target.value })}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1">Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={settingsDraft.heroSubtitle}
                    onChange={(e) => setSettingsDraft({ ...settingsDraft, heroSubtitle: e.target.value })}
                    className={TEXTAREA_CLASS}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#9A3412] dark:bg-[#B4411B] text-white text-sm font-semibold hover:bg-[#7C2D12] dark:hover:bg-[#C74B21] inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save Site Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: BOARD & BEREAVEMENT DIRECTORY */}
          {activeTab === 'directory' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 space-y-5">
                <h2 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                  2026 Board of Trustees & Coordinators
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!boardForm.name.trim() || !boardForm.role.trim()) return;
                    addBoardMember(boardForm);
                    setBoardForm({ role: '', name: '', phone: '', group: 'Coordinators' });
                    notify('Board member added.');
                  }}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-3 pb-5 border-b border-[#EDE6DA] dark:border-[#2F2722]"
                >
                  <input
                    type="text"
                    required
                    value={boardForm.role}
                    onChange={(e) => setBoardForm({ ...boardForm, role: e.target.value })}
                    placeholder="Role (e.g. Cultural Lead)"
                    className={INPUT_CLASS}
                  />
                  <input
                    type="text"
                    required
                    value={boardForm.name}
                    onChange={(e) => setBoardForm({ ...boardForm, name: e.target.value })}
                    placeholder="Full Name"
                    className={INPUT_CLASS}
                  />
                  <input
                    type="text"
                    value={boardForm.phone}
                    onChange={(e) => setBoardForm({ ...boardForm, phone: e.target.value })}
                    placeholder="(306) 555-0100"
                    className={INPUT_CLASS}
                  />
                  <button
                    type="submit"
                    className="min-h-[44px] px-4 rounded-xl bg-[#9A3412] dark:bg-[#B4411B] text-white text-sm font-semibold cursor-pointer"
                  >
                    Add Member
                  </button>
                </form>

                <div className="divide-y divide-[#EDE6DA] dark:divide-[#2A231E]">
                  {data.board.map((m) => (
                    <div key={m.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#1C1714] dark:text-[#F6F1EA]">{m.name}</p>
                        <p className="text-xs text-[#665B51] dark:text-[#A99C8E] tabular-nums">
                          {m.role} · {m.phone}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          deleteBoardMember(m.id);
                          notify('Board member removed.');
                        }}
                        className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg border border-[#E5DDD0] dark:border-[#3A302A] text-[#7D6E5D] dark:text-[#A99C8E] hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 space-y-4">
                <h2 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                  Bereavement Committee
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!berName.trim()) return;
                    addBereavementMember({ name: berName.trim(), phone: berPhone.trim() || undefined });
                    setBerName('');
                    setBerPhone('');
                    notify('Bereavement volunteer added.');
                  }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-4 border-b border-[#EDE6DA] dark:border-[#2F2722]"
                >
                  <input
                    type="text"
                    required
                    value={berName}
                    onChange={(e) => setBerName(e.target.value)}
                    placeholder="Volunteer Name"
                    className={INPUT_CLASS}
                  />
                  <input
                    type="text"
                    value={berPhone}
                    onChange={(e) => setBerPhone(e.target.value)}
                    placeholder="Phone (optional)"
                    className={INPUT_CLASS}
                  />
                  <button
                    type="submit"
                    className="min-h-[44px] px-4 rounded-xl bg-[#1C1714] dark:bg-[#F6F1EA] text-white dark:text-[#1C1714] text-sm font-semibold cursor-pointer"
                  >
                    Add Volunteer
                  </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.bereavement.map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-xl bg-[#FAF8F4] dark:bg-[#14110F] border border-[#E5DDD0] dark:border-[#2F2722] flex items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#1C1714] dark:text-[#F6F1EA]">{b.name}</p>
                        <p className="text-xs text-[#665B51] dark:text-[#A99C8E] tabular-nums">
                          {b.phone || 'Committee Member'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteBereavementMember(b.id)}
                        className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-[#7D6E5D] dark:text-[#A99C8E] hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: INBOX & SUBSCRIBERS */}
          {activeTab === 'inbox' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 space-y-4">
                <h2 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                  Contact Form Inquiries ({data.inquiries.length})
                </h2>
                {data.inquiries.length === 0 ? (
                  <p className="text-sm text-[#665B51] dark:text-[#A99C8E]">No messages yet.</p>
                ) : (
                  <div className="divide-y divide-[#EDE6DA] dark:divide-[#2A231E]">
                    {data.inquiries.map((inq) => (
                      <div key={inq.id} className="py-4 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-xs text-[#7D6E5D] dark:text-[#A99C8E]">
                            <span className="font-semibold text-[#9A3412] dark:text-[#F08A5D]">{inq.topic}</span> ·{' '}
                            <span>{inq.status}</span> ·{' '}
                            <span className="tabular-nums">
                              {new Date(inq.submittedAt).toLocaleDateString('en-CA')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleInquiryStatus(inq.id)}
                              className="min-h-[36px] px-3 rounded-lg border border-[#DCD2C3] dark:border-[#3A302A] text-xs font-medium text-[#1C1714] dark:text-[#F6F1EA] hover:border-[#9A3412] dark:hover:border-[#F08A5D] cursor-pointer"
                            >
                              Mark {inq.status === 'New' ? 'Reviewed' : 'New'}
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteInquiry(inq.id)}
                              className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg border border-[#E5DDD0] dark:border-[#3A302A] text-[#7D6E5D] dark:text-[#A99C8E] hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-[#1C1714] dark:text-[#F6F1EA]">
                          {inq.name} ·{' '}
                          <span className="font-normal text-[#544A41] dark:text-[#CFC4B7]">{inq.email}</span>
                          {inq.phone ? ` · ${inq.phone}` : ''}
                        </p>
                        <p className="text-sm text-[#3B3026] dark:text-[#DDD3C7] leading-relaxed">{inq.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 space-y-4">
                <h2 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                  Email Newsletter Subscribers ({data.subscribers.length})
                </h2>
                <div className="divide-y divide-[#EDE6DA] dark:divide-[#2A231E]">
                  {data.subscribers.map((sub) => (
                    <div key={sub.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[#1C1714] dark:text-[#F6F1EA]">{sub.email}</p>
                        <p className="text-xs text-[#7D6E5D] dark:text-[#A99C8E] tabular-nums">
                          Joined {new Date(sub.subscribedAt).toLocaleDateString('en-CA')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteSubscriber(sub.id)}
                        className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-[#7D6E5D] dark:text-[#A99C8E] hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: BACKUP & GITHUB DEPLOY */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 space-y-4">
                <h2 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                  Export & Import Temple Data (GitHub Pages Ready)
                </h2>
                <p className="text-sm text-[#544A41] dark:text-[#CFC4B7] leading-relaxed">
                  This website is pre-configured with relative asset paths, hash routing, and a GitHub Actions Pages deployment workflow so you can push directly to GitHub and publish to GitHub Pages with zero server required. Use Export JSON to back up your calendar, gallery, and announcements anytime.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#9A3412] dark:bg-[#B4411B] text-white text-sm font-semibold hover:bg-[#7C2D12] dark:hover:bg-[#C74B21] inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Export Temple Data (.json)
                  </button>

                  <label className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#1C1714] dark:border-[#E4DBD0] text-[#1C1714] dark:text-[#F6F1EA] text-sm font-medium hover:bg-[#1C1714] hover:text-white dark:hover:bg-[#F6F1EA] dark:hover:text-[#1C1714] inline-flex items-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    Import JSON Backup
                    <input type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
                  </label>
                </div>

                {importStatus && (
                  <p className="text-xs font-medium text-[#9A3412] dark:text-[#F08A5D] pt-1">{importStatus}</p>
                )}
              </div>

              <div className="bg-[#F2EDE4] dark:bg-[#191411] border border-[#E2D8C9] dark:border-[#2F2722] rounded-2xl p-6 space-y-3">
                <h3 className="font-serif text-xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                  Reset to Official Regina Hindu Temple Defaults
                </h3>
                <p className="text-xs sm:text-sm text-[#544A41] dark:text-[#CFC4B7]">
                  Restores all 20 original temple photographs, the official 2026 Vikram Samvat festival calendar, and the 2026 Board of Trustees directory.
                </p>
                {confirmReset ? (
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        resetToDefaults();
                        setConfirmReset(false);
                        notify('Site restored to official defaults.');
                      }}
                      className="min-h-[42px] px-4 py-2 rounded-xl bg-red-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      Confirm Full Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="min-h-[42px] px-4 py-2 rounded-xl bg-white dark:bg-[#251F1B] border border-[#D4C7B5] dark:border-[#3A302A] text-xs font-medium text-[#1C1714] dark:text-[#F6F1EA] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="min-h-[42px] px-4 py-2 rounded-xl border border-[#C9BAA5] dark:border-[#3A302A] bg-white dark:bg-[#221C18] text-xs font-semibold text-[#1C1714] dark:text-[#F6F1EA] hover:border-red-700 hover:text-red-700 dark:hover:text-red-400 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset to Official Data
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
