import { Suspense } from 'react';
import { getHome } from '@/lib/api';
import { Hero } from '@/components/home/Hero';
import { ConsultationCategories } from '@/components/home/ConsultationCategories';
import { ComboOffers } from '@/components/home/ComboOffers';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Testimonials } from '@/components/home/Testimonials';
import { Faq } from '@/components/home/Faq';
import { ContactSection } from '@/components/home/ContactSection';
import { BookingForm } from '@/components/booking/BookingForm';
import { BookingSectionHeader } from '@/components/booking/BookingSectionHeader';
import { VedicGallery } from '@/components/home/VedicGallery';
import { GemstoneOfferPopup } from '@/components/home/GemstoneOfferPopup';

export default async function HomePage() {
  const home = await getHome();

  return (
    <>
      <GemstoneOfferPopup />
      <Hero contact={home.contact} />
      <ConsultationCategories categories={home.categories} />
      <ComboOffers combos={home.combos} />
      <WhyChooseUs items={home.whyChooseUs} />
      <HowItWorks steps={home.howItWorks} />
      <VedicGallery />
      <Testimonials testimonials={home.testimonials} />
      <Faq faqs={home.faqs} />

      <section id="booking" className="bg-gradient-to-b from-[#FFF3E0]/50 via-amber-50/40 to-orange-50/60 py-8 sm:py-16 md:py-20 border-t border-orange-200/35">
        <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
          <BookingSectionHeader />
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
