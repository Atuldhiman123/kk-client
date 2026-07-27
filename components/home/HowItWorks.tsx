import type { HowItWorksStep } from '@/lib/types';

export function HowItWorks({ steps }: { steps: HowItWorksStep[] }) {
  return (
    <section className="bg-neutral-900 py-20 text-white shadow-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-amber-500/20 px-4 py-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
            ⚡ Quick 4-Step Process
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">How It Works</h2>
          <p className="mt-3 max-w-xl mx-auto text-sm text-neutral-400">
            Booking your online consultation takes less than 2 minutes.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.step} className="relative flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-2xl font-extrabold text-neutral-950 shadow-lg transition hover:scale-110">
                {step.step}
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-400">
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
