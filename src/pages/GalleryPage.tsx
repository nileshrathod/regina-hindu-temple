import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Grid2X2,
  LayoutGrid,
  Search,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { GalleryAlbum, GalleryPhoto } from '../types/temple';
import { useTempleData } from '../context/TempleDataContext';
import { SafeImage } from '../components/SafeImage';

const ALBUMS: ('All' | GalleryAlbum)[] = [
  'All',
  'Sanctum & Deities',
  'Rath Yatra 2025',
  'Temple Heritage (1989–1993)',
  'Architecture & Bells',
  'Community & Notices',
];

export const GalleryPage: React.FC = () => {
  const { data } = useTempleData();
  const [activeAlbum, setActiveAlbum] = useState<'All' | GalleryAlbum>('All');
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'masonry' | 'grid'>('grid');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const touchStartX = useRef<number | null>(null);

  const filteredPhotos = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.gallery.filter((photo) => {
      const albumMatch = activeAlbum === 'All' || photo.album === activeAlbum;
      const queryMatch =
        !q ||
        photo.title.toLowerCase().includes(q) ||
        photo.caption.toLowerCase().includes(q) ||
        photo.year.toLowerCase().includes(q) ||
        photo.album.toLowerCase().includes(q);
      return albumMatch && queryMatch;
    });
  }, [data.gallery, activeAlbum, query]);

  const currentPhoto: GalleryPhoto | null =
    lightboxIndex !== null && filteredPhotos[lightboxIndex] ? filteredPhotos[lightboxIndex] : null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setZoomed(false);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setZoomed(false);
  };

  const goNext = () => {
    if (lightboxIndex === null || filteredPhotos.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
    setZoomed(false);
  };

  const goPrev = () => {
    if (lightboxIndex === null || filteredPhotos.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    setZoomed(false);
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, filteredPhotos.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 48) return;
    if (delta < 0) goNext();
    else goPrev();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#120F0D] transition-colors duration-200">
      {/* Full-Width Editorial Gallery Header */}
      <section className="bg-[#1C1714] dark:bg-[#0D0A08] text-white border-b border-[#322A24] dark:border-[#26201C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[#E6C594]">
                Visual Archive · 1989 – 2026
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">
                Regina Hindu Temple Gallery
              </h1>
              <p className="text-sm sm:text-base text-[#D4C9BC] leading-relaxed">
                Explore authentic photographs of our main marble sanctum, Rath Yatra 2025 festivities, the historic 1989 Bhoomi Pooja and 1990 construction chronicle, and official 2026 temple directories.
              </p>
            </div>
            <div className="text-xs text-[#BEB3A6] tabular-nums">
              {filteredPhotos.length} of {data.gallery.length} Photographs · Tap any image for full-screen view
            </div>
          </div>
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="sticky top-13 md:top-16 z-30 bg-[#FAF8F4]/95 dark:bg-[#161210]/95 backdrop-blur-md border-b border-[#E5DDD0] dark:border-[#2F2722]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Album Filter Controls */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {ALBUMS.map((album) => {
                const count =
                  album === 'All'
                    ? data.gallery.length
                    : data.gallery.filter((p) => p.album === album).length;
                const active = activeAlbum === album;
                return (
                  <button
                    key={album}
                    type="button"
                    onClick={() => setActiveAlbum(album)}
                    className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#9A3412] dark:bg-[#B4411B] text-white'
                        : 'bg-[#EFE9DF] dark:bg-[#221C18] text-[#4E443B] dark:text-[#CFC4B7] hover:bg-[#E5DDD0] dark:hover:bg-[#2D2520] hover:text-[#1C1714] dark:hover:text-white'
                    }`}
                  >
                    {album} <span className="opacity-75 tabular-nums">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Search + View Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-4 h-4 text-[#857768] dark:text-[#A99C8E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search caption or year..."
                  aria-label="Search gallery photos"
                  className="w-full min-h-[40px] pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-[#1C1714] border border-[#DCD2C3] dark:border-[#3A302A] text-sm text-[#1C1714] dark:text-[#F6F1EA] placeholder:text-[#8B7E70] dark:placeholder:text-[#8E8072] focus:outline-none focus:border-[#9A3412] dark:focus:border-[#F08A5D]"
                />
              </div>

              <div className="flex items-center p-1 bg-[#EFE9DF] dark:bg-[#221C18] rounded-lg shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Uniform Grid Layout"
                  title="Uniform Grid"
                  className={`min-w-[36px] min-h-[34px] flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-[#322924] text-[#1C1714] dark:text-[#F6F1EA] shadow-xs'
                      : 'text-[#665B51] dark:text-[#A99C8E]'
                  }`}
                >
                  <Grid2X2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('masonry')}
                  aria-label="Editorial Masonry Layout"
                  title="Editorial Masonry"
                  className={`min-w-[36px] min-h-[34px] flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                    viewMode === 'masonry'
                      ? 'bg-white dark:bg-[#322924] text-[#1C1714] dark:text-[#F6F1EA] shadow-xs'
                      : 'text-[#665B51] dark:text-[#A99C8E]'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Page Gallery Canvas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-8">
            <h2 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
              No photographs match your search
            </h2>
            <p className="text-sm text-[#665B51] dark:text-[#A99C8E] mt-2">
              Try clearing your filter or switching to All Photos.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveAlbum('All');
                setQuery('');
              }}
              className="mt-5 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#9A3412] dark:bg-[#B4411B] text-white text-sm font-semibold hover:bg-[#7C2D12] cursor-pointer"
            >
              Show All Photographs
            </button>
          </div>
        ) : viewMode === 'masonry' ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredPhotos.map((photo, idx) => (
              <figure
                key={photo.id}
                className="break-inside-avoid bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl overflow-hidden group transition-shadow hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => openLightbox(idx)}
                  className="block w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#9A3412]"
                >
                  <div className="relative overflow-hidden bg-[#EFE9DF] dark:bg-[#251F1B]">
                    <SafeImage
                      src={photo.src}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                  <figcaption className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-xs text-[#7D6E5D] dark:text-[#A99C8E] tabular-nums">
                      <span className="text-[#9A3412] dark:text-[#F08A5D] font-semibold">{photo.album}</span>
                      <span aria-hidden="true">·</span>
                      <span>{photo.year}</span>
                    </div>
                    <h2 className="font-serif text-xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1 leading-snug">
                      {photo.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5E5247] dark:text-[#CFC4B7] mt-1.5 leading-relaxed line-clamp-3">
                      {photo.caption}
                    </p>
                  </figcaption>
                </button>
              </figure>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, idx) => (
              <figure
                key={photo.id}
                className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl overflow-hidden group flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => openLightbox(idx)}
                  className="flex-1 flex flex-col text-left cursor-pointer"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[#EFE9DF] dark:bg-[#251F1B]">
                    <SafeImage
                      src={photo.src}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <figcaption className="p-4 sm:p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-[#7D6E5D] dark:text-[#A99C8E] tabular-nums">
                      <span className="text-[#9A3412] dark:text-[#F08A5D] font-semibold">{photo.album}</span>
                      <span aria-hidden="true">·</span>
                      <span>{photo.year}</span>
                    </div>
                    <h2 className="font-serif text-xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1 leading-snug">
                      {photo.title}
                    </h2>
                    <p className="text-xs text-[#5E5247] dark:text-[#CFC4B7] mt-1.5 line-clamp-2 leading-relaxed">
                      {photo.caption}
                    </p>
                  </figcaption>
                </button>
              </figure>
            ))}
          </div>
        )}
      </section>

      {/* Full-Screen Touch-Swipe Lightbox */}
      {currentPhoto && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-[#120E0C]/97 text-white flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={currentPhoto.title}
        >
          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5 border-b border-white/10 pt-safe">
            <div className="min-w-0">
              <p className="text-xs text-[#E6C594] truncate tabular-nums">
                {lightboxIndex + 1} / {filteredPhotos.length} · {currentPhoto.album} · {currentPhoto.year}
              </p>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white truncate">
                {currentPhoto.title}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                {zoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
              </button>
              <a
                href={currentPhoto.src}
                download={`${currentPhoto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`}
                aria-label="Download photograph"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Download className="w-5 h-5" />
              </a>
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close lightbox"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            className="flex-1 relative flex items-center justify-center overflow-auto p-4 sm:p-8 select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous photo"
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 min-w-[48px] min-h-[48px] items-center justify-center rounded-full bg-black/50 hover:bg-black/80 border border-white/15 text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <SafeImage
              src={currentPhoto.src}
              alt={currentPhoto.title}
              onClick={() => setZoomed((z) => !z)}
              className={`rounded-lg transition-transform duration-300 cursor-zoom-in ${
                zoomed
                  ? 'max-w-none w-[140vw] sm:w-auto sm:max-h-none sm:scale-125 cursor-zoom-out'
                  : 'max-h-[62vh] sm:max-h-[68vh] max-w-full object-contain'
              }`}
            />

            <button
              type="button"
              onClick={goNext}
              aria-label="Next photo"
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 min-w-[48px] min-h-[48px] items-center justify-center rounded-full bg-black/50 hover:bg-black/80 border border-white/15 text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="border-t border-white/10 bg-[#181310] px-4 sm:px-6 py-3.5 pb-safe space-y-3">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-[#D8CFC3] leading-relaxed">
                {currentPhoto.caption}
              </p>
              <div className="flex sm:hidden items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex-1 min-h-[44px] rounded-xl bg-white/10 text-xs font-medium flex items-center justify-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 min-h-[44px] rounded-xl bg-white/10 text-xs font-medium flex items-center justify-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-4xl mx-auto">
              {filteredPhotos.map((thumb, idx) => (
                <button
                  key={thumb.id}
                  type="button"
                  onClick={() => openLightbox(idx)}
                  aria-label={`View ${thumb.title}`}
                  className={`w-14 h-11 rounded-md overflow-hidden shrink-0 border-2 transition-opacity cursor-pointer ${
                    idx === lightboxIndex
                      ? 'border-[#E6C594] opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-85'
                  }`}
                >
                  <SafeImage src={thumb.src} alt={thumb.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
