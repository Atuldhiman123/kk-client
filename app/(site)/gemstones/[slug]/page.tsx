import { notFound } from 'next/navigation';
import { ApiError, getGemstone, getHome } from '@/lib/api';
import { GemstoneDetailClient } from '@/components/gemstone/GemstoneDetailClient';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
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

export default async function GemstoneDetailPage(props: { params: Promise<{ slug: string }> }) {
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

  return <GemstoneDetailClient gemstone={gemstone} contact={home.contact} />;
}
