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
      title: `${gemstone.name} | AstroConsult Gemstones`,
      description: gemstone.shortDescription ?? gemstone.description ?? undefined,
    };
  } catch {
    return { title: 'Gemstone | AstroConsult' };
  }
}

export default async function GemstoneDetailPage(props: PageProps<'/gemstones/[slug]'>) {
  const { slug } = await props.params;

  const [gemstone, home] = await Promise.all([
    getGemstone(slug).catch((err) => {
      if (err instanceof ApiError && err.status === 404) return null;
      throw err;
    }),
    getHome().catch(() => null),
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

  const contact = home?.contact;
  const whatsappMessage = `Hi, I'm interested in the ${gemstone.name} (${formatInr(gemstone.price)}).`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <GemstoneGallery images={gemstone.images} fallbackImage={gemstone.image} name={gemstone.name} />

        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{gemstone.name}</h1>
          {gemstone.shortDescription && (
            <p className="mt-2 text-neutral-600">{gemstone.shortDescription}</p>
          )}
          <div className="mt-4 text-2xl font-bold" style={{ color: '#B8860B' }}>
            {formatInr(gemstone.price)}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {contact && (
              <>
                <a
                  href={waLink(contact.whatsapp, whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <span aria-hidden>💬</span> Enquire on WhatsApp
                </a>
                <a
                  href={telLink(contact.phone)}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-800"
                >
                  <span aria-hidden>📞</span> Call Now
                </a>
              </>
            )}
          </div>

          <div className="mt-8 space-y-6">
            {sections
              .filter(([, content]) => Boolean(content))
              .map(([label, content]) => (
                <div key={label}>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                    {label}
                  </h2>
                  <p className="mt-1 text-neutral-700">{content}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {gemstone.related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-neutral-900">Related Gemstones</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {gemstone.related.map((related) => (
              <GemstoneCard key={related.id} gemstone={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
