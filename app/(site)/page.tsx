import { Suspense } from 'react';
import { getHome } from '@/lib/api';
import { Hero } from '@/components/home/Hero';
import { Stats } from '@/components/home/Stats';
import { ConsultationCategories } from '@/components/home/ConsultationCategories';
import { ComboOffers } from '@/components/home/ComboOffers';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Testimonials } from '@/components/home/Testimonials';
import { Faq } from '@/components/home/Faq';
import { ContactSection } from '@/components/home/ContactSection';
import { BookingForm } from '@/components/booking/BookingForm';
import { VedicGallery } from '@/components/home/VedicGallery';

export default async function HomePage() {
  const home = await getHome();

  return (
    <>
      <Hero contact={home.contact} />
      <Stats stats={home.stats} />
      <ConsultationCategories categories={home.categories} />
      <ComboOffers combos={home.combos} />
      <WhyChooseUs items={home.whyChooseUs} />
      <HowItWorks steps={home.howItWorks} />
      <VedicGallery />
      <Testimonials testimonials={home.testimonials} />
      <Faq faqs={home.faqs} />

      <section id="booking" className="bg-gradient-to-b from-[#FFF3E0]/50 via-amber-50/40 to-orange-50/60 py-8 sm:py-16 md:py-20 border-t border-orange-200/35">
        <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="rounded-full bg-orange-600/10 px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
              📅 Reserve Your Slot
            </span>
            <h2 className="mt-1.5 sm:mt-3 text-xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 font-serif">
              Book Your Consultation
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-base text-neutral-700 font-medium max-w-lg mx-auto">
              Fill in your details below — it only takes a couple of minutes.
            </p>
          </div>
          <div className="mt-4 sm:mt-8">
            <Suspense fallback={null}>
              <BookingForm
                categories={home.categories}
                combos={home.combos}
                paymentConfig={home.paymentConfig}
              />
            </Suspense>
          </div>
        </div>
      </section>

      <ContactSection contact={home.contact} />
    </>
  );
}
