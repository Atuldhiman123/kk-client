'use client';

import type { ContactInfo, GemstoneDetail } from '@/lib/types';
import { formatInr } from '@/lib/format';
import { telLink, waLink } from '@/lib/contact';
import { GemstoneGallery } from '@/components/gemstone/GemstoneGallery';
import { GemstoneCard } from '@/components/gemstone/GemstoneCard';
import { useLanguage, getLocalizedGemstone } from '@/lib/i18n';

interface Props {
  gemstone: GemstoneDetail;
  contact: ContactInfo;
}

export function GemstoneDetailClient({ gemstone, contact }: Props) {
  const { locale, t } = useLanguage();
  const locGemstone = getLocalizedGemstone(gemstone, locale);

  const sections: [string, string | null][] = [
    [t.gemstones_page.sections.description, locGemstone.description ?? locGemstone.shortDescription],
    [t.gemstones_page.sections.benefits, locGemstone.benefits],
    [t.gemstones_page.sections.who_should_wear, locGemstone.whoShouldWear],
    [t.gemstones_page.sections.weight_options, locGemstone.weightOptions],
    [t.gemstones_page.sections.certification, locGemstone.certification],
    [t.gemstones_page.sections.care_instructions, locGemstone.careInstructions],
  ];

  const whatsappMessage = locale === 'hi'
    ? `नमस्ते Kundli Kendra, मैं ${locGemstone.name} (${formatInr(locGemstone.price)}) के बारे में जानकारी चाहता हूँ।`
    : `Hi, I'm interested in the ${locGemstone.name} (${formatInr(locGemstone.price)}).`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
        <GemstoneGallery images={locGemstone.images} fallbackImage={locGemstone.image} name={locGemstone.name} />

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-serif">{locGemstone.name}</h1>
          {locGemstone.shortDescription && (
            <p className="mt-2 text-sm sm:text-base text-neutral-600 leading-relaxed">{locGemstone.shortDescription}</p>
          )}
          <div className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold" style={{ color: '#B8860B' }}>
            {formatInr(locGemstone.price)}
          </div>

          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            {contact && (
              <>
                <a
                  href={waLink(contact.whatsapp, whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:opacity-90"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <span aria-hidden>💬</span> {t.gemstones_page.enquire_whatsapp}
                </a>
                <a
                  href={telLink(contact.phone)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-neutral-800 shadow-2xs hover:border-orange-400"
                >
                  <span aria-hidden>📞</span> {t.gemstones_page.call_now}
                </a>
              </>
            )}
          </div>

          <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            {sections
              .filter(([, content]) => Boolean(content))
              .map(([label, content]) => (
                <div key={label} className="border-b border-orange-100/70 pb-3.5 last:border-0">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-orange-950">
                    {label}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-700 leading-relaxed">{content}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {gemstone.related.length > 0 && (
        <div className="mt-12 sm:mt-16 border-t border-orange-200/60 pt-10 sm:pt-14">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 font-serif">{t.gemstones_page.related_title}</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {gemstone.related.map((related) => (
              <GemstoneCard key={related.id} gemstone={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
