import React, { useState } from 'react';
import { Check, Copy, ExternalLink, X } from 'lucide-react';
import { useTempleData } from '../context/TempleDataContext';

interface DonateModalProps {
  open: boolean;
  onClose: () => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({ open, onClose }) => {
  const { data } = useTempleData();
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.settings.interacEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="donate-modal-title"
    >
      <div
        className="w-full sm:max-w-lg bg-[#FAF8F4] dark:bg-[#1C1714] rounded-t-3xl sm:rounded-2xl border border-[#E5DDD0] dark:border-[#322924] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile grab handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-[#D7CCBC] dark:bg-[#463B34]" />
        </div>

        <div className="px-6 py-4 border-b border-[#E5DDD0] dark:border-[#2F2722] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#7D6E5D] dark:text-[#A99C8E]">Hindu Samaj of Southern Saskatchewan</p>
            <h2 id="donate-modal-title" className="font-serif text-2xl font-bold text-[#1C1714] dark:text-[#F6F1EA]">
              Offerings & Seva
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close donations window"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#544A41] dark:text-[#CFC4B7] hover:bg-[#EFE9DF] dark:hover:bg-[#2A231E] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          <div className="bg-white dark:bg-[#14110F] border border-[#E5DDD0] dark:border-[#2F2722] rounded-xl p-4 sm:p-5">
            <p className="text-xs text-[#665B51] dark:text-[#A99C8E] mb-1">Interac e-Transfer (Auto-Deposit)</p>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-base sm:text-lg font-semibold text-[#1C1714] dark:text-[#F6F1EA] tabular-nums break-all">
                {data.settings.interacEmail}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="min-h-[40px] px-4 py-2 rounded-lg bg-[#9A3412] dark:bg-[#B4411B] text-white text-xs font-semibold hover:bg-[#7C2D12] dark:hover:bg-[#C74B21] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied Email' : 'Copy Email'}
              </button>
            </div>
            <p className="text-xs text-[#665B51] dark:text-[#A99C8E] mt-3 leading-relaxed">
              Include your full name, mailing address, and Seva purpose (General Donation, 2026 Annual Membership, Sunday Prasadam, or Hindu Vidyalaya) in the Interac memo for your tax receipt.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'General Temple Fund', note: 'Sanctuary & daily upkeep' },
              { label: 'Sunday Prasadam Seva', note: 'Weekly community meal' },
              { label: 'Hindu Vidyalaya', note: 'Youth heritage education' },
              { label: 'Festival Sponsorship', note: 'Navratri, Diwali & Rath Yatra' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3.5 rounded-xl bg-[#F2EDE4] dark:bg-[#251F1B] border border-[#E5DDD0] dark:border-[#322924]"
              >
                <div className="font-semibold text-[#1C1714] dark:text-[#F6F1EA] text-xs sm:text-sm">
                  {item.label}
                </div>
                <div className="text-xs text-[#665B51] dark:text-[#A99C8E] mt-0.5">{item.note}</div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E5DDD0] dark:border-[#2F2722] text-center space-y-2">
            <p className="font-serif text-base text-[#7C2D12] dark:text-[#E6C594] leading-relaxed">
              {data.settings.donationShloka}
            </p>
            <p className="text-xs text-[#665B51] dark:text-[#A99C8E] italic leading-relaxed">
              “{data.settings.donationTranslation}”
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#F2EDE4] dark:bg-[#161210] border-t border-[#E5DDD0] dark:border-[#2F2722] flex flex-col sm:flex-row gap-3">
          <a
            href={data.settings.membershipFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#1C1714] dark:bg-[#F6F1EA] text-white dark:text-[#1C1714] text-sm font-semibold hover:bg-[#332A24] dark:hover:bg-white transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            2026 Annual Membership Form
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#D4C7B5] dark:border-[#3A302A] bg-white dark:bg-[#221C18] text-sm font-medium text-[#1C1714] dark:text-[#F6F1EA] hover:bg-[#FAF8F4] dark:hover:bg-[#2C2420] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
