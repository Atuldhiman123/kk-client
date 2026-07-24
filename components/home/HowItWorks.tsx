import type { HowItWorksStep } from '@/lib/types';

export function HowItWorks({ steps }: { steps: HowItWorksStep[] }) {
  return (
    <section className="bg-neutral-900 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold">How It Works</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-neutral-900"
                style={{ backgroundColor: '#F3D98B' }}
              >
                {step.step}
              </div>
              <p className="mt-3 text-sm font-semibold">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
