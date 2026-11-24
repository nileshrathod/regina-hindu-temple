import React, { useState } from 'react';
import { Check, Copy, ExternalLink, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useTempleData } from '../context/TempleDataContext';

const INQUIRY_TOPICS = [
  'General Inquiry',
  'Priest & Puja Booking',
  'Prasadam Sponsorship',
  'Temple / Kitchen Rental',
  'Hindu Vidyalaya Enrollment',
  'Bereavement Support',
  '2026 Annual Membership / Donations',
];

export const ContactPage: React.FC = () => {
  const { data, submitInquiry, addSubscriber } = useTempleData();
  const { settings } = data;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState(INQUIRY_TOPICS[0]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [subEmail, setSubEmail] = useState('');
  const [subSaved, setSubSaved] = useState(false);
  const [copiedInterac, setCopiedInterac] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    submitInquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      topic,
      message: message.trim(),
    });
    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (addSubscriber(subEmail)) {
      setSubSaved(true);
      setSubEmail('');
    }
  };

  const copyInterac = async () => {
    try {
      await navigator.clipboard.writeText(settings.interacEmail);
      setCopiedInterac(true);
      setTimeout(() => setCopiedInterac(false), 2400);
    } catch {
      setCopiedInterac(false);
    }
  };

  const keyContacts = [
    { role: 'Temple General Line', person: 'Regina Hindu Temple', phone: settings.templePhone },
    { role: 'Temple Priest (Puja & Rituals)', person: settings.priestName, phone: settings.priestPhone },
    { role: 'Prasadam Seva Coordinator', person: settings.prasadamCoordinator, phone: settings.prasadamPhone },
    { role: 'Private Booking Calendar', person: settings.bookingCoordinator, phone: settings.bookingPhone },
    { role: 'Temple & Kitchen Rentals', person: settings.rentalCoordinator, phone: settings.rentalPhone },
    { role: 'Hindu Vidyalaya Principal', person: settings.vidyalayaPrincipal, phone: settings.vidyalayaPhone },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#120F0D] transition-colors duration-200">
      {/* Page Hero */}
      <section className="bg-[#1C1714] dark:bg-[#0D0A08] text-white border-b border-[#322A24] dark:border-[#26201C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs uppercase tracking-[0.16em] text-[#E6C594]">
              Visit & Connect · 3307 Pasqua St., Regina
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">
              Contact Us
            </h1>
            <p className="text-sm sm:text-base text-[#D4C9BC] leading-relaxed">
              Reach our priest, committee coordinators, or submit a message directly to the Hindu Samaj of Southern Saskatchewan. Every inquiry submitted here appears immediately in the Temple Admin Console.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl p-6 sm:p-8">
            <div className="pb-5 border-b border-[#EDE6DA] dark:border-[#2F2722]">
              <h2 className="font-serif text-3xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                Send a Message to the Temple
              </h2>
              <p className="text-sm text-[#665B51] dark:text-[#A99C8E] mt-1">
                Inquiries for poojas, hall rentals, Prasadam sponsorship, Vidyalaya, or general questions.
              </p>
            </div>

            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#15803D]/10 dark:bg-[#4ADE80]/15 text-[#15803D] dark:text-[#4ADE80] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                  Thanks for submitting!
                </h3>
                <p className="text-sm text-[#544A41] dark:text-[#CFC4B7] max-w-md mx-auto leading-relaxed">
                  Your message has been received by the Hindu Samaj of Southern Saskatchewan and logged in the Temple Admin Inbox. A volunteer coordinator will respond shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#1C1714] dark:bg-[#F6F1EA] text-white dark:text-[#1C1714] text-sm font-semibold hover:bg-[#332A24] dark:hover:bg-white cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="pt-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#FAF8F4] dark:bg-[#14110F] border border-[#DCD2C3] dark:border-[#3A302A] text-sm text-[#1C1714] dark:text-[#F6F1EA] placeholder:text-[#8B7E70] focus:outline-none focus:border-[#9A3412] dark:focus:border-[#F08A5D]"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1.5">
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(306) 555-0199"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#FAF8F4] dark:bg-[#14110F] border border-[#DCD2C3] dark:border-[#3A302A] text-sm text-[#1C1714] dark:text-[#F6F1EA] placeholder:text-[#8B7E70] focus:outline-none focus:border-[#9A3412] dark:focus:border-[#F08A5D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.ca"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#FAF8F4] dark:bg-[#14110F] border border-[#DCD2C3] dark:border-[#3A302A] text-sm text-[#1C1714] dark:text-[#F6F1EA] placeholder:text-[#8B7E70] focus:outline-none focus:border-[#9A3412] dark:focus:border-[#F08A5D]"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-topic" className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1.5">
                      Department / Topic
                    </label>
                    <select
                      id="contact-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#FAF8F4] dark:bg-[#14110F] border border-[#DCD2C3] dark:border-[#3A302A] text-sm text-[#1C1714] dark:text-[#F6F1EA] focus:outline-none focus:border-[#9A3412] dark:focus:border-[#F08A5D]"
                    >
                      {INQUIRY_TOPICS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-[#4E443B] dark:text-[#CFC4B7] mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your preferred date, ceremony details, or question..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F4] dark:bg-[#14110F] border border-[#DCD2C3] dark:border-[#3A302A] text-sm text-[#1C1714] dark:text-[#F6F1EA] placeholder:text-[#8B7E70] focus:outline-none focus:border-[#9A3412] dark:focus:border-[#F08A5D]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-xl bg-[#9A3412] dark:bg-[#B4411B] text-white text-sm font-semibold hover:bg-[#7C2D12] dark:hover:bg-[#C74B21] active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Submit Message
                </button>
              </form>
            )}
          </div>

          {/* Right 5 Cols: Address, Map & Interac */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] rounded-2xl overflow-hidden">
              <div className="p-6 space-y-3">
                <p className="text-xs uppercase tracking-[0.14em] text-[#9A3412] dark:text-[#F08A5D] font-semibold">
                  Sanctuary Location
                </p>
                <h2 className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
                  {settings.organizationName}
                </h2>
                <p className="text-sm text-[#4E443B] dark:text-[#CFC4B7] flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#9A3412] dark:text-[#F08A5D] shrink-0 mt-0.5" />
                  <span>
                    {settings.address}, {settings.cityProvincePostal}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <a
                    href="https://maps.google.com/?q=3307+Pasqua+St+Regina+SK+S4S+7G8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[42px] px-4 py-2 rounded-xl bg-[#1C1714] dark:bg-[#F6F1EA] text-white dark:text-[#1C1714] text-xs font-semibold hover:bg-[#332A24] dark:hover:bg-white inline-flex items-center gap-1.5"
                  >
                    Google Maps Directions
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://maps.apple.com/?q=3307+Pasqua+St,+Regina,+SK+S4S+7G8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[42px] px-4 py-2 rounded-xl border border-[#D4C7B5] dark:border-[#3A302A] text-[#1C1714] dark:text-[#F6F1EA] text-xs font-medium hover:border-[#9A3412] dark:hover:border-[#F08A5D] inline-flex items-center gap-1.5"
                  >
                    Apple Maps (iOS)
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="h-56 w-full border-t border-[#E5DDD0] dark:border-[#2F2722] bg-[#EFE9DF] dark:bg-[#251F1B]">
                <iframe
                  title="Regina Hindu Temple — 3307 Pasqua St., Regina Map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-104.6525%2C50.4170%2C-104.6285%2C50.4285&layer=mapnik&marker=50.4227%2C-104.6406"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Interac & Newsletter Card */}
            <div className="bg-[#F2EDE4] dark:bg-[#191411] border border-[#E2D8C9] dark:border-[#2F2722] rounded-2xl p-6 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#9A3412] dark:text-[#F08A5D] font-semibold">
                  Donations · Interac e-Transfer
                </p>
                <div className="flex items-center justify-between gap-2 mt-2 bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#322924] rounded-xl px-4 py-3">
                  <span className="text-sm font-semibold text-[#1C1714] dark:text-[#F6F1EA] break-all">
                    {settings.interacEmail}
                  </span>
                  <button
                    type="button"
                    onClick={copyInterac}
                    className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#FAF8F4] dark:bg-[#251F1B] border border-[#DCD2C3] dark:border-[#3A302A] text-xs font-medium text-[#1C1714] dark:text-[#F6F1EA] hover:border-[#9A3412] dark:hover:border-[#F08A5D] inline-flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedInterac ? <Check className="w-3.5 h-3.5 text-[#15803D] dark:text-[#4ADE80]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedInterac ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#DFD5C5] dark:border-[#2F2722]">
                <p className="text-xs uppercase tracking-[0.14em] text-[#7D6E5D] dark:text-[#A99C8E] font-medium">
                  Subscribe for Email Updates
                </p>
                <p className="text-xs text-[#544A41] dark:text-[#CFC4B7] mt-1">
                  Receive festival timings, Havan notices, and community bulletins.
                </p>
                {subSaved ? (
                  <p className="mt-3 text-xs font-semibold text-[#15803D] dark:text-[#4ADE80] flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    Subscribed to Regina Hindu Temple email updates.
                  </p>
                ) : (
                  <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
                    <input
                      type="email"
                      required
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                      placeholder="Enter your email"
                      aria-label="Email address for temple updates"
                      className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C1714] border border-[#DCD2C3] dark:border-[#3A302A] text-sm text-[#1C1714] dark:text-[#F6F1EA] placeholder:text-[#8B7E70] focus:outline-none focus:border-[#9A3412] dark:focus:border-[#F08A5D]"
                    />
                    <button
                      type="submit"
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-[#9A3412] dark:bg-[#B4411B] text-white text-xs font-semibold hover:bg-[#7C2D12] dark:hover:bg-[#C74B21] cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Direct Quick-Dial Phone Directory */}
        <div className="space-y-4">
          <div className="border-b border-[#E5DDD0] dark:border-[#2F2722] pb-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7D6E5D] dark:text-[#A99C8E]">
              Direct Telephone Directory
            </p>
            <h2 className="font-serif text-3xl font-bold text-[#1C1714] dark:text-[#F6F1EA] mt-1">
              One-Tap Coordinator Contacts
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyContacts.map((item) => (
              <a
                key={item.role}
                href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                className="bg-white dark:bg-[#1C1714] border border-[#E5DDD0] dark:border-[#2F2722] hover:border-[#9A3412] dark:hover:border-[#F08A5D] rounded-2xl p-5 flex items-center justify-between gap-4 transition-colors"
              >
                <div>
                  <p className="text-xs text-[#7D6E5D] dark:text-[#A99C8E]">{item.role}</p>
                  <p className="text-base font-semibold text-[#1C1714] dark:text-[#F6F1EA] mt-0.5">{item.person}</p>
                </div>
                <span className="text-sm font-semibold text-[#9A3412] dark:text-[#F08A5D] inline-flex items-center gap-1.5 tabular-nums whitespace-nowrap shrink-0">
                  <Phone className="w-4 h-4" />
                  {item.phone}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
