import type { HowItWorksStep } from '@/lib/types';

export function HowItWorks({ steps }: { steps: HowItWorksStep[] }) {
  return (
    <section className="bg-gradient-to-b from-[#FFF3E0] via-[#FFE0B2]/40 to-[#FFF8E1]/50 py-12 sm:py-20 border-t border-orange-200/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-orange-600/10 px-3.5 sm:px-4 py-1 sm:py-1.5 text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
            ⚡ Quick 4-Step Process
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 font-serif">
            How It Works
          </h2>
          <p className="mt-2.5 sm:mt-3 max-w-xl mx-auto text-sm sm:text-base text-neutral-700 font-medium">
            Booking your online consultation takes less than 2 minutes.
          </p>
        </div>

        <div className="mt-8 sm:mt-14 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.step} className="relative flex flex-col items-center text-center p-2">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-xl sm:text-2xl font-extrabold text-white shadow-md transition hover:scale-105">
                {step.step}
              </div>
              <h3 className="mt-3.5 sm:mt-5 text-base sm:text-lg font-bold text-neutral-900 font-serif">{step.title}</h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-neutral-600">
                {step.step === 1 && 'Pick a specific topic or combo package.'}
                {step.step === 2 && 'Choose your convenient date & available time slot.'}
                {step.step === 3 && 'Complete quick payment via UPI & get instant confirmation.'}
                {step.step === 4 && 'Connect live with Astrologer Atul on phone or WhatsApp.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
