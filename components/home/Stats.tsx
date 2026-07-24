import type { Stat } from '@/lib/types';

export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section className="border-y border-black/5 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl font-bold sm:text-3xl" style={{ color: '#B8860B' }}>
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-neutral-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
