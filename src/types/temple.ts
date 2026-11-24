export type RouteKey = 'home' | 'calendar' | 'gallery' | 'services' | 'contact' | 'admin';

export type CalendarCategory = 'festival' | 'hours' | 'prasadam' | 'booking';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  fallsOnLabel?: string; // e.g., "Thursday, September 3rd"
  celebratedOnLabel?: string; // e.g., "Sunday, September 20th"
  time: string;
  category: CalendarCategory;
  description: string;
  coordinator?: string;
  status?: 'Confirmed' | 'Available to Sponsor' | 'Sponsored' | 'Private Booking (Closed to Public)';
  featured?: boolean;
}

export type GalleryAlbum =
  | 'Sanctum & Deities'
  | 'Rath Yatra 2025'
  | 'Temple Heritage (1989–1993)'
  | 'Architecture & Bells'
  | 'Community & Notices';

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  album: GalleryAlbum;
  year: string;
  src: string;
  aspect?: 'landscape' | 'portrait' | 'wide' | 'square';
  featured?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  body: string;
  date: string; // YYYY-MM-DD
  category: 'Festival Notice' | 'Community Update' | 'Vidyalaya' | 'Seva & Appeal';
  pinned?: boolean;
  published: boolean;
}

export interface ScheduleSlot {
  id: string;
  title: string;
  timing: string;
  frequency: string;
  note?: string;
}

export interface BoardMember {
  id: string;
  role: string;
  name: string;
  phone: string;
  group: 'Executive' | 'Coordinators' | 'Vidyalaya';
}

export interface BereavementMember {
  id: string;
  name: string;
  phone?: string;
}

export interface InquiryMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  submittedAt: string;
  status: 'New' | 'Reviewed';
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface SiteSettings {
  templeName: string;
  organizationName: string;
  establishedDate: string;
  openedDate: string;
  address: string;
  cityProvincePostal: string;
  templePhone: string;
  priestName: string;
  priestPhone: string;
  interacEmail: string;
  prasadamCoordinator: string;
  prasadamPhone: string;
  bookingCoordinator: string;
  bookingPhone: string;
  rentalCoordinator: string;
  rentalPhone: string;
  vidyalayaPrincipal: string;
  vidyalayaPhone: string;
  membershipFormUrl: string;
  vidyalayaFormUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  mantra: string;
  tickerNotice: string;
  donationShloka: string;
  donationTranslation: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface TempleSiteData {
  settings: SiteSettings;
  schedules: ScheduleSlot[];
  events: CalendarEvent[];
  gallery: GalleryPhoto[];
  news: NewsItem[];
  board: BoardMember[];
  bereavement: BereavementMember[];
  inquiries: InquiryMessage[];
  subscribers: Subscriber[];
}
