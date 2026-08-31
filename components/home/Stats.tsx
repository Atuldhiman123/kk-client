import type { Stat } from '@/lib/types';

export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section className="border-y border-amber-200/60 bg-white/90 py-8 sm:py-10 shadow-xs backdrop-blur-xs">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:gap-6 px-3.5 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center rounded-2xl border border-amber-100 bg-gradient-to-b from-amber-50/50 to-white p-3.5 sm:p-5 shadow-2xs transition hover:scale-103 hover:border-amber-300 text-center"
          >
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-amber-600">
              {stat.value}
            </div>
            <div className="mt-1 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-700">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
