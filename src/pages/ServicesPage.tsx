import React, { useState } from 'react';
import { ExternalLink, FileText, Phone, X } from 'lucide-react';
import { useTempleData } from '../context/TempleDataContext';
import { SafeImage } from '../components/SafeImage';

type ServiceSection = 'services' | 'vidyalaya' | 'board' | 'history';

export const ServicesPage: React.FC = () => {
  const { data } = useTempleData();
  const { settings, board, bereavement } = data;
  const [section, setSection] = useState<ServiceSection>('services');
  const [showBoardPoster, setShowBoardPoster] = useState(false);

  const executive = board.filter((b) => b.group === 'Executive');
  const coordinators = board.filter((b) => b.group !== 'Executive');

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#120F0D] transition-colors duration-200">
      {/* Page Hero */}
      <section className="bg-[#1C1714] dark:bg-[#0D0A08] text-white border-b border-[#322A24] dark:border-[#26201C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs uppercase tracking-[0.16em] text-[#E6C594]">
              Hindu Samaj of Southern Saskatchewan
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">
              Services, Vidyalaya, Board & Heritage
            </h1>
            <p className="text-sm sm:text-base text-[#D4C9BC] leading-relaxed">
              Connect with our temple priest, enroll children in Hindu Vidyalaya, reserve temple facilities, contact the Bereavement Committee, or meet our volunteer 2026 Board of Trustees.
            </p>
          </div>
        </div>
      </section>

      {/* Section Switcher Bar */}
      <div className="sticky top-13 md:top-16 z-30 bg-[#FAF8F4]/95 dark:bg-[#161210]/95 backdrop-blur-md border-b border-[#E5DDD0] dark:border-[#2F2722]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { key: 'services' as ServiceSection, label: 'Priest, Rentals & Bereavement' },
            { key: 'vidyalaya' as ServiceSection, label: 'Hindu Vidyalaya' },
            { key: 'board' as ServiceSection, label: '2026 Board of Trustees' },
            { key: 'history' as ServiceSection, label: 'Temple History (1947–Present)' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSection(tab.key)}
              className={`min-h-[42px] px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                section === tab.key
                  ? 'bg-[#9A3412] dark:bg-[#B4411B] text-white'
                  : 'bg-[#EFE9DF] dark:bg-[#221C18] text-[#4E443B] dark:text-[#CFC4B7] hover:bg-[#E5DDD0] dark:hover:bg-[#2D2520] hover:text-[#1C1714] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* TAB 1: PRIEST, RENTALS & BEREAVEMENT */}
        {section === 'services' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-5 rounded-2xl overflow-hidden bg-[#EFE9DF] dark:bg-[#221C18] min-h-[260px]">
                <SafeImage
                  src="./images/temple/24_services-2_4fae127a.jpg"
                  alt="Brass temple bells at Regina Hindu Temple"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Temple Priest */}
                <div className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#9A3412] dark:text-[#F08A5D] font-semibold">
                      Vedic Rituals & Pooja
                    </p>
                    <h2 className="font-serif text-3xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1">
                      Temple Priest
                    </h2>
                    <p className="text-lg font-semibold text-[#1C1714] dark:text-[#F6F1EA] mt-4">
                      {settings.priestName}
                    </p>
                    <p className="text-sm text-[#544A41] dark:text-[#CFC4B7] mt-2 leading-relaxed">
                      Available for home and temple poojas, Satyanarayan Katha, Griha Pravesh, Namakaran, Weddings, Monthly Havan, and Shanti Paath ceremonies. Priest serves on honorarium.
                    </p>
                  </div>
                  <a
                    href={`tel:${settings.priestPhone.replace(/[^0-9]/g, '')}`}
                    className="mt-6 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#9A3412] dark:bg-[#B4411B] text-white text-sm font-semibold hover:bg-[#7C2D12] dark:hover:bg-[#C74B21] inline-flex items-center justify-center gap-2 tabular-nums"
                  >
                    <Phone className="w-4 h-4" />
                    Call {settings.priestPhone}
                  </a>
                </div>

                {/* Temple & Kitchen Rentals */}
                <div className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#9A3412] dark:text-[#F08A5D] font-semibold">
                      Sanctuary & Bhavan Kitchen
                    </p>
                    <h2 className="font-serif text-3xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1">
                      Temple Rentals
                    </h2>
                    <p className="text-lg font-semibold text-[#1C1714] dark:text-[#F6F1EA] mt-4">
                      {settings.rentalCoordinator}
                    </p>
                    <p className="text-sm text-[#544A41] dark:text-[#CFC4B7] mt-2 leading-relaxed">
                      The temple sanctuary and Bhavan kitchen are available for rent for personal or community religious events. Minimum rental duration is 2 hours. During private bookings, the temple remains closed to the general public.
                    </p>
                  </div>
                  <div className="mt-6 space-y-2">
                    <a
                      href={`tel:${settings.rentalPhone.replace(/[^0-9]/g, '')}`}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#1C1714] dark:bg-[#F6F1EA] text-white dark:text-[#1C1714] text-sm font-semibold hover:bg-[#332A24] dark:hover:bg-white inline-flex items-center justify-center gap-2 tabular-nums"
                    >
                      <Phone className="w-4 h-4" />
                      Rentals: {settings.rentalPhone}
                    </a>
                    <p className="text-xs text-center text-[#665B51] dark:text-[#A99C8E] tabular-nums">
                      Booking Calendar: {settings.bookingCoordinator} · {settings.bookingPhone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bereavement Support Committee */}
            <div className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.14em] text-[#9A3412] dark:text-[#F08A5D] font-semibold">
                  Compassionate Community Support
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1">
                  Bereavement Committee
                </h2>
                <p className="text-sm sm:text-base text-[#544A41] dark:text-[#CFC4B7] mt-2 leading-relaxed">
                  The Bereavement Committee supports Hindu families in Southern Saskatchewan in making funeral and cremation arrangements, organizing Shanti Paath ceremonies, and offering guidance during times of loss.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {bereavement.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-xl bg-[#FAF8F4] dark:bg-[#14110F] border border-[#E5DDD0] dark:border-[#2F2722] flex flex-col justify-between gap-2"
                  >
                    <p className="font-semibold text-[#1C1714] dark:text-[#F6F1EA] text-sm sm:text-base">
                      {member.name}
                    </p>
                    {member.phone ? (
                      <a
                        href={`tel:${member.phone.replace(/[^0-9]/g, '')}`}
                        className="text-sm font-semibold text-[#9A3412] dark:text-[#F08A5D] hover:underline inline-flex items-center gap-1.5 tabular-nums min-h-[36px]"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {member.phone}
                      </a>
                    ) : (
                      <p className="text-xs text-[#7D6E5D] dark:text-[#A99C8E]">Committee Volunteer</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HINDU VIDYALAYA */}
        {section === 'vidyalaya' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-5">
                <p className="text-xs uppercase tracking-[0.14em] text-[#9A3412] dark:text-[#F08A5D] font-semibold">
                  Sunday School · Pre-K to Grade 12
                </p>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                  Hindu Vidyalaya
                </h2>
                <p className="text-sm sm:text-base text-[#3B3026] dark:text-[#DDD3C7] leading-relaxed">
                  The Hindu Vidyalaya is the dedicated Sunday school program operated by the Hindu Samaj of Southern Saskatchewan at the Regina Hindu Temple (3307 Pasqua St.). It bridges generations for youth growing up in Canada, keeping them rooted in their linguistic, spiritual, and cultural heritage.
                </p>
                <p className="text-sm sm:text-base text-[#544A41] dark:text-[#CFC4B7] leading-relaxed">
                  Classes run every Sunday from{' '}
                  <strong className="text-[#1C1714] dark:text-[#F6F1EA]">10:30 AM to 11:30 AM</strong>, coinciding with the temple’s weekly Satsang so parents may attend worship while children learn in an age-appropriate setting, followed by congregational Prasadam in the Bhavan.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
                  {[
                    {
                      title: 'Cultural & Religious Education',
                      text: 'Lessons on Hindu scriptures, the significance of festivals, and the lives of Indian saints and historical figures.',
                    },
                    {
                      title: 'Indian Language Classes',
                      text: 'Instruction in languages such as Hindi and Gujarati to connect with extended family and traditional prayers.',
                    },
                    {
                      title: 'Spiritual Practices',
                      text: 'Teaching children basic Shlokas (chants), Bhajans (devotional songs), and the meaning of Vedic Havan rituals.',
                    },
                    {
                      title: 'Values & Ethics (Dharma)',
                      text: 'Cultivating universal principles of respect, discipline, compassion, and community seva.',
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-5"
                    >
                      <h3 className="font-serif text-xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#544A41] dark:text-[#CFC4B7] mt-1.5 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-5">
                <div className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 space-y-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#7D6E5D] dark:text-[#A99C8E]">
                    2026 Registration Open
                  </p>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                    Enroll Your Child Today
                  </h3>
                  <dl className="divide-y divide-[#EDE6DA] dark:divide-[#2A231E] text-sm">
                    <div className="py-2.5 flex justify-between gap-4">
                      <dt className="text-[#665B51] dark:text-[#A99C8E]">Schedule</dt>
                      <dd className="font-semibold text-[#1C1714] dark:text-[#F6F1EA] tabular-nums">
                        Sundays · 10:30 – 11:30 AM
                      </dd>
                    </div>
                    <div className="py-2.5 flex justify-between gap-4">
                      <dt className="text-[#665B51] dark:text-[#A99C8E]">Grades</dt>
                      <dd className="font-semibold text-[#1C1714] dark:text-[#F6F1EA]">Pre-K to Grade 12</dd>
                    </div>
                    <div className="py-2.5 flex justify-between gap-4">
                      <dt className="text-[#665B51] dark:text-[#A99C8E]">Principal</dt>
                      <dd className="font-semibold text-[#1C1714] dark:text-[#F6F1EA]">
                        {settings.vidyalayaPrincipal}
                      </dd>
                    </div>
                    <div className="py-2.5 flex justify-between gap-4">
                      <dt className="text-[#665B51] dark:text-[#A99C8E]">Contact</dt>
                      <dd>
                        <a
                          href={`tel:${settings.vidyalayaPhone.replace(/[^0-9]/g, '')}`}
                          className="font-semibold text-[#9A3412] dark:text-[#F08A5D] underline underline-offset-4 tabular-nums"
                        >
                          {settings.vidyalayaPhone}
                        </a>
                      </dd>
                    </div>
                  </dl>
                  <a
                    href={settings.vidyalayaFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#9A3412] dark:bg-[#B4411B] text-white text-sm font-semibold hover:bg-[#7C2D12] dark:hover:bg-[#C74B21] inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    2026 Hindu Vidyalaya Registration
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="bg-[#F2EDE4] dark:bg-[#191411] border border-[#E2D8C9] dark:border-[#2F2722] rounded-2xl p-6 space-y-2 text-sm text-[#4E443B] dark:text-[#CFC4B7]">
                  <h4 className="font-serif text-xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                    Facilities & Community
                  </h4>
                  <p>
                    <strong className="text-[#1C1714] dark:text-[#F6F1EA]">The Resource Centre:</strong> Dedicated classrooms equipped for Vidyalaya instruction.
                  </p>
                  <p>
                    <strong className="text-[#1C1714] dark:text-[#F6F1EA]">The Bhavan:</strong> Lower hall used for group activities, festival student performances, and Sunday Prasadam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 2026 BOARD OF TRUSTEES */}
        {section === 'board' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E5DDD0] dark:border-[#2F2722]">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#9A3412] dark:text-[#F08A5D] font-semibold">
                  Volunteer Leadership · 2026 Term
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1">
                  Board of Trustees & Committee Coordinators
                </h2>
                <p className="text-sm text-[#544A41] dark:text-[#CFC4B7] mt-2">
                  All trustees and committee members are volunteers. To contribute or join a committee, please contact any trustee or email {settings.interacEmail}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBoardPoster(true)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#D4C7B5] dark:border-[#3A302A] bg-white dark:bg-[#1C1714] text-xs sm:text-sm font-medium text-[#1C1714] dark:text-[#F6F1EA] hover:border-[#9A3412] dark:hover:border-[#F08A5D] hover:text-[#9A3412] dark:hover:text-[#F08A5D] inline-flex items-center gap-2 whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#9A3412] dark:text-[#F08A5D]" />
                View Official Board Poster
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                Executive Committee
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {executive.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-5 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#9A3412] dark:text-[#F08A5D] font-semibold">
                        {member.role}
                      </p>
                      <p className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1">
                        {member.name}
                      </p>
                    </div>
                    <a
                      href={`tel:${member.phone.replace(/[^0-9]/g, '')}`}
                      className="text-sm font-medium text-[#3B3026] dark:text-[#DDD3C7] hover:text-[#9A3412] dark:hover:text-[#F08A5D] inline-flex items-center gap-1.5 tabular-nums min-h-[36px]"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#9A3412] dark:text-[#F08A5D]" />
                      {member.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                Committee Coordinators & Vidyalaya Principal
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coordinators.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-xs text-[#7D6E5D] dark:text-[#A99C8E] font-medium">{member.role}</p>
                      <p className="text-base font-semibold text-[#1C1714] dark:text-[#F6F1EA] mt-0.5">
                        {member.name}
                      </p>
                    </div>
                    <a
                      href={`tel:${member.phone.replace(/[^0-9]/g, '')}`}
                      className="min-h-[40px] px-3 py-2 rounded-lg bg-[#FAF8F4] dark:bg-[#251F1B] border border-[#E5DDD0] dark:border-[#3A302A] text-xs font-semibold text-[#9A3412] dark:text-[#F08A5D] hover:bg-[#9A3412] hover:text-white dark:hover:bg-[#B4411B] dark:hover:text-white transition-colors inline-flex items-center gap-1.5 tabular-nums whitespace-nowrap shrink-0"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {member.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TEMPLE HISTORY */}
        {section === 'history' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-7 space-y-6">
                <p className="text-xs uppercase tracking-[0.14em] text-[#9A3412] dark:text-[#F08A5D] font-semibold">
                  Archival Chronicle · 1947 – Present
                </p>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                  History of Regina Hindu Temple
                </h2>

                <div className="space-y-5 text-sm sm:text-base text-[#3B3026] dark:text-[#DDD3C7] leading-relaxed max-w-prose">
                  <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#9A3412] dark:first-letter:text-[#F08A5D]">
                    A majority of immigrants to Regina from India arrived after independence in 1947 as professionals across medicine, education, and engineering. In the early 1960s, as Hindu families grew across Regina, devotees began gathering in one another’s homes for scripture reading and fellowship. By the early 1970s, Ramesh Aire initiated weekend satsangs and festival celebrations at venues such as the Odd Fellows’ Temple, taking devotional gatherings even to surrounding rural Saskatchewan towns.
                  </p>
                  <p>
                    On <strong className="text-[#1C1714] dark:text-[#F6F1EA]">May 24, 1987</strong>, six local Hindu organizations united to establish a permanent Hindu temple, incorporated on{' '}
                    <strong className="text-[#1C1714] dark:text-[#F6F1EA]">June 15, 1987</strong> as the{' '}
                    <strong className="text-[#1C1714] dark:text-[#F6F1EA]">Hindu Samaj of Southern Saskatchewan</strong>. Under the leadership of{' '}
                    <strong className="text-[#1C1714] dark:text-[#F6F1EA]">Dr. Krishna Kumar</strong>, board members raised funds across southern Saskatchewan to turn the vision into stone and timber.
                  </p>
                  <p>
                    In the <strong className="text-[#1C1714] dark:text-[#F6F1EA]">summer of 1989</strong>,{' '}
                    <strong className="text-[#1C1714] dark:text-[#F6F1EA]">Dr. Usharbudh Arya</strong> conducted the sacred <em>Bhoomi Pooja</em> (sod-turning ceremony). Construction began the following year, and the temple officially opened its doors to devotees on{' '}
                    <strong className="text-[#1C1714] dark:text-[#F6F1EA]">September 13, 1990 (Vijay Dashami Day)</strong>. <em>Murthi Sthapana</em> (installation of the marble deities) took place in{' '}
                    <strong className="text-[#1C1714] dark:text-[#F6F1EA]">October 1993</strong> under the direction of{' '}
                    <strong className="text-[#1C1714] dark:text-[#F6F1EA]">Dr. Shreedhar Jachak</strong>.
                  </p>
                  <p>
                    Today, the Hindu Samaj holds weekly Sunday Satsang, operates the Resource Centre for Hindu Vidyalaya and the Bhavan for congregational meals, welcomes public open houses, hosts visiting spiritual scholars, offers a student scholarship at the University of Regina for the study of Hinduism, and serves as a founding member of the Regina Multi-Faith Forum.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-5">
                {[
                  {
                    src: './images/temple/09_history_5e4abe30.jpg',
                    caption: 'Fig. 1 — Regina Hindu Temple at 3307 Pasqua St., opened September 13, 1990.',
                  },
                  {
                    src: './images/temple/14_history_e4aba136.png',
                    caption: 'Fig. 2 — Summer 1989: Dr. Usharbudh Arya performing Bhoomi Pooja sod-turning.',
                  },
                  {
                    src: './images/temple/20_history_897de886.png',
                    caption: 'Fig. 3 — September 17, 1993: Constructing the sanctum altar before Murthi Sthapana.',
                  },
                ].map((fig) => (
                  <figure
                    key={fig.src}
                    className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl overflow-hidden"
                  >
                    <SafeImage src={fig.src} alt={fig.caption} className="w-full h-auto object-cover" />
                    <figcaption className="px-4 py-3 text-xs italic text-[#5E5247] dark:text-[#BFB5A8]">
                      {fig.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Official Board of Trustees Poster Modal */}
      {showBoardPoster && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowBoardPoster(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#322924] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-[#E5DDD0] dark:border-[#2F2722] flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                2026 Board of Trustees — Official Poster
              </h3>
              <button
                type="button"
                onClick={() => setShowBoardPoster(false)}
                aria-label="Close board poster"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#1C1714] dark:text-[#F6F1EA] hover:bg-[#FAF8F4] dark:hover:bg-[#2A231E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto p-4 bg-[#FAF8F4] dark:bg-[#120F0D]">
              <SafeImage
                src="./images/temple/22_board_44cf8da3.jpg"
                alt="2026 Board of Trustees of Hindu Samaj of Southern Saskatchewan"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
