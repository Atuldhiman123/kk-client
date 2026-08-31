import { notFound } from 'next/navigation';
import { ApiError, getGemstone, getHome } from '@/lib/api';
import { formatInr } from '@/lib/format';
import { telLink, waLink } from '@/lib/contact';
import { GemstoneGallery } from '@/components/gemstone/GemstoneGallery';
import { GemstoneCard } from '@/components/gemstone/GemstoneCard';

export async function generateMetadata(props: PageProps<'/gemstones/[slug]'>) {
  const { slug } = await props.params;
  try {
    const gemstone = await getGemstone(slug);
    return {
      title: `${gemstone.name} | Kundli Kendra Gemstones`,
      description: gemstone.shortDescription ?? gemstone.description ?? undefined,
    };
  } catch {
    return { title: 'Gemstone | Kundli Kendra' };
  }
}

export default async function GemstoneDetailPage(props: PageProps<'/gemstones/[slug]'>) {
  const { slug } = await props.params;

  const [gemstone, home] = await Promise.all([
    getGemstone(slug).catch((err) => {
      if (err instanceof ApiError && err.status === 404) return null;
      throw err;
    }),
    getHome(),
  ]);

  if (!gemstone) {
    notFound();
  }

  const sections: [string, string | null][] = [
    ['Description', gemstone.description],
    ['Benefits', gemstone.benefits],
    ['Who Should Wear', gemstone.whoShouldWear],
    ['Weight Options', gemstone.weightOptions],
    ['Certification', gemstone.certification],
    ['Care Instructions', gemstone.careInstructions],
  ];

  const contact = home.contact;
  const whatsappMessage = `Hi, I'm interested in the ${gemstone.name} (${formatInr(gemstone.price)}).`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
        <GemstoneGallery images={gemstone.images} fallbackImage={gemstone.image} name={gemstone.name} />

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-serif">{gemstone.name}</h1>
          {gemstone.shortDescription && (
            <p className="mt-2 text-sm sm:text-base text-neutral-600 leading-relaxed">{gemstone.shortDescription}</p>
          )}
          <div className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold" style={{ color: '#B8860B' }}>
            {formatInr(gemstone.price)}
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
                  <span aria-hidden>💬</span> Enquire on WhatsApp
                </a>
                <a
                  href={telLink(contact.phone)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-neutral-800 shadow-2xs hover:border-orange-400"
                >
                  <span aria-hidden>📞</span> Call Now
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
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 font-serif">Related Gemstones</h2>
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
