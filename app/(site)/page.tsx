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
import { BookingSection } from '@/components/booking/BookingSection';
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

      <Suspense fallback={null}>
        <BookingSection
          categories={home.categories}
          combos={home.combos}
          paymentConfig={home.paymentConfig}
        />
      </Suspense>

      <ContactSection contact={home.contact} />
    </>
  );
}
