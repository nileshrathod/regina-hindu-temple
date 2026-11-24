import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_TEMPLE_DATA } from '../data/defaultTempleData';
import {
  BereavementMember,
  BoardMember,
  CalendarEvent,
  GalleryPhoto,
  InquiryMessage,
  NewsItem,
  ScheduleSlot,
  SiteSettings,
  TempleSiteData,
} from '../types/temple';

const STORAGE_KEY = 'regina_hindu_temple_cms_v1';

interface TempleDataContextValue {
  data: TempleSiteData;
  updateSettings: (patch: Partial<SiteSettings>) => void;
  // Calendar Events
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, patch: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  // Gallery Photos
  addPhoto: (photo: Omit<GalleryPhoto, 'id'>) => void;
  updatePhoto: (id: string, patch: Partial<GalleryPhoto>) => void;
  deletePhoto: (id: string) => void;
  // News & Announcements
  addNews: (item: Omit<NewsItem, 'id'>) => void;
  updateNews: (id: string, patch: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  // Schedules
  addSchedule: (slot: Omit<ScheduleSlot, 'id'>) => void;
  updateSchedule: (id: string, patch: Partial<ScheduleSlot>) => void;
  deleteSchedule: (id: string) => void;
  // Board & Bereavement
  addBoardMember: (member: Omit<BoardMember, 'id'>) => void;
  updateBoardMember: (id: string, patch: Partial<BoardMember>) => void;
  deleteBoardMember: (id: string) => void;
  addBereavementMember: (member: Omit<BereavementMember, 'id'>) => void;
  deleteBereavementMember: (id: string) => void;
  // Inquiries & Subscribers
  submitInquiry: (inquiry: Omit<InquiryMessage, 'id' | 'submittedAt' | 'status'>) => void;
  toggleInquiryStatus: (id: string) => void;
  deleteInquiry: (id: string) => void;
  addSubscriber: (email: string) => boolean;
  deleteSubscriber: (id: string) => void;
  // Import / Export / Reset
  exportJson: () => string;
  importJson: (jsonStr: string) => { ok: boolean; error?: string };
  resetToDefaults: () => void;
}

const TempleDataContext = createContext<TempleDataContextValue | null>(null);

function loadInitialData(): TempleSiteData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_TEMPLE_DATA;
    const parsed = JSON.parse(raw) as Partial<TempleSiteData>;
    return {
      settings: { ...DEFAULT_TEMPLE_DATA.settings, ...(parsed.settings || {}) },
      schedules: parsed.schedules ?? DEFAULT_TEMPLE_DATA.schedules,
      events: parsed.events ?? DEFAULT_TEMPLE_DATA.events,
      gallery: parsed.gallery ?? DEFAULT_TEMPLE_DATA.gallery,
      news: parsed.news ?? DEFAULT_TEMPLE_DATA.news,
      board: parsed.board ?? DEFAULT_TEMPLE_DATA.board,
      bereavement: parsed.bereavement ?? DEFAULT_TEMPLE_DATA.bereavement,
      inquiries: parsed.inquiries ?? DEFAULT_TEMPLE_DATA.inquiries,
      subscribers: parsed.subscribers ?? DEFAULT_TEMPLE_DATA.subscribers,
    };
  } catch {
    return DEFAULT_TEMPLE_DATA;
  }
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export const TempleDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<TempleSiteData>(loadInitialData);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore quota errors if user uploads very large base64 photos
    }
  }, [data]);

  const updateSettings = (patch: Partial<SiteSettings>) =>
    setData((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));

  const addEvent = (event: Omit<CalendarEvent, 'id'>) =>
    setData((prev) => ({
      ...prev,
      events: [{ ...event, id: makeId('evt') }, ...prev.events].sort((a, b) =>
        a.date.localeCompare(b.date)
      ),
    }));

  const updateEvent = (id: string, patch: Partial<CalendarEvent>) =>
    setData((prev) => ({
      ...prev,
      events: prev.events
        .map((e) => (e.id === id ? { ...e, ...patch } : e))
        .sort((a, b) => a.date.localeCompare(b.date)),
    }));

  const deleteEvent = (id: string) =>
    setData((prev) => ({ ...prev, events: prev.events.filter((e) => e.id !== id) }));

  const addPhoto = (photo: Omit<GalleryPhoto, 'id'>) =>
    setData((prev) => ({ ...prev, gallery: [{ ...photo, id: makeId('gal') }, ...prev.gallery] }));

  const updatePhoto = (id: string, patch: Partial<GalleryPhoto>) =>
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));

  const deletePhoto = (id: string) =>
    setData((prev) => ({ ...prev, gallery: prev.gallery.filter((p) => p.id !== id) }));

  const addNews = (item: Omit<NewsItem, 'id'>) =>
    setData((prev) => ({ ...prev, news: [{ ...item, id: makeId('news') }, ...prev.news] }));

  const updateNews = (id: string, patch: Partial<NewsItem>) =>
    setData((prev) => ({
      ...prev,
      news: prev.news.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    }));

  const deleteNews = (id: string) =>
    setData((prev) => ({ ...prev, news: prev.news.filter((n) => n.id !== id) }));

  const addSchedule = (slot: Omit<ScheduleSlot, 'id'>) =>
    setData((prev) => ({
      ...prev,
      schedules: [...prev.schedules, { ...slot, id: makeId('sched') }],
    }));

  const updateSchedule = (id: string, patch: Partial<ScheduleSlot>) =>
    setData((prev) => ({
      ...prev,
      schedules: prev.schedules.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));

  const deleteSchedule = (id: string) =>
    setData((prev) => ({ ...prev, schedules: prev.schedules.filter((s) => s.id !== id) }));

  const addBoardMember = (member: Omit<BoardMember, 'id'>) =>
    setData((prev) => ({
      ...prev,
      board: [...prev.board, { ...member, id: makeId('board') }],
    }));

  const updateBoardMember = (id: string, patch: Partial<BoardMember>) =>
    setData((prev) => ({
      ...prev,
      board: prev.board.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }));

  const deleteBoardMember = (id: string) =>
    setData((prev) => ({ ...prev, board: prev.board.filter((b) => b.id !== id) }));

  const addBereavementMember = (member: Omit<BereavementMember, 'id'>) =>
    setData((prev) => ({
      ...prev,
      bereavement: [...prev.bereavement, { ...member, id: makeId('ber') }],
    }));

  const deleteBereavementMember = (id: string) =>
    setData((prev) => ({
      ...prev,
      bereavement: prev.bereavement.filter((b) => b.id !== id),
    }));

  const submitInquiry = (inquiry: Omit<InquiryMessage, 'id' | 'submittedAt' | 'status'>) =>
    setData((prev) => ({
      ...prev,
      inquiries: [
        {
          ...inquiry,
          id: makeId('inq'),
          submittedAt: new Date().toISOString(),
          status: 'New',
        },
        ...prev.inquiries,
      ],
    }));

  const toggleInquiryStatus = (id: string) =>
    setData((prev) => ({
      ...prev,
      inquiries: prev.inquiries.map((inq) =>
        inq.id === id ? { ...inq, status: inq.status === 'New' ? 'Reviewed' : 'New' } : inq
      ),
    }));

  const deleteInquiry = (id: string) =>
    setData((prev) => ({ ...prev, inquiries: prev.inquiries.filter((inq) => inq.id !== id) }));

  const addSubscriber = (email: string) => {
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes('@')) return false;
    setData((prev) => {
      if (prev.subscribers.some((s) => s.email.toLowerCase() === clean)) return prev;
      return {
        ...prev,
        subscribers: [
          { id: makeId('sub'), email: clean, subscribedAt: new Date().toISOString() },
          ...prev.subscribers,
        ],
      };
    });
    return true;
  };

  const deleteSubscriber = (id: string) =>
    setData((prev) => ({ ...prev, subscribers: prev.subscribers.filter((s) => s.id !== id) }));

  const exportJson = () => JSON.stringify(data, null, 2);

  const importJson = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr) as Partial<TempleSiteData>;
      if (!parsed || typeof parsed !== 'object' || !parsed.settings) {
        return { ok: false, error: 'Invalid temple data format: missing settings object.' };
      }
      setData({
        settings: { ...DEFAULT_TEMPLE_DATA.settings, ...parsed.settings },
        schedules: parsed.schedules ?? DEFAULT_TEMPLE_DATA.schedules,
        events: parsed.events ?? DEFAULT_TEMPLE_DATA.events,
        gallery: parsed.gallery ?? DEFAULT_TEMPLE_DATA.gallery,
        news: parsed.news ?? DEFAULT_TEMPLE_DATA.news,
        board: parsed.board ?? DEFAULT_TEMPLE_DATA.board,
        bereavement: parsed.bereavement ?? DEFAULT_TEMPLE_DATA.bereavement,
        inquiries: parsed.inquiries ?? [],
        subscribers: parsed.subscribers ?? [],
      });
      return { ok: true };
    } catch {
      return { ok: false, error: 'Could not parse JSON file. Please verify the file contents.' };
    }
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(DEFAULT_TEMPLE_DATA);
  };

  return (
    <TempleDataContext.Provider
      value={{
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
        updateBoardMember,
        deleteBoardMember,
        addBereavementMember,
        deleteBereavementMember,
        submitInquiry,
        toggleInquiryStatus,
        deleteInquiry,
        addSubscriber,
        deleteSubscriber,
        exportJson,
        importJson,
        resetToDefaults,
      }}
    >
      {children}
    </TempleDataContext.Provider>
  );
};

export function useTempleData(): TempleDataContextValue {
  const ctx = useContext(TempleDataContext);
  if (!ctx) throw new Error('useTempleData must be used inside TempleDataProvider');
  return ctx;
}
