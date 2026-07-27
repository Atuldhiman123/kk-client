import { Suspense } from 'react';
import { getHome, DEFAULT_HOME_DATA } from '@/lib/api';
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

export default async function HomePage() {
  const home = await getHome().catch(() => DEFAULT_HOME_DATA);

  return (
    <>
      <Hero contact={home.contact} />
      <Stats stats={home.stats} />
      <ConsultationCategories categories={home.categories} />
      <ComboOffers combos={home.combos} />
      <WhyChooseUs items={home.whyChooseUs} />
      <HowItWorks steps={home.howItWorks} />
      <Testimonials testimonials={home.testimonials} />
      <Faq faqs={home.faqs} />

      <section id="booking" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900">Book Your Consultation</h2>
          <p className="mt-2 text-neutral-600">
            Fill in your details below — it only takes a couple of minutes.
          </p>
        </div>
        <div className="mt-10">
          <Suspense fallback={null}>
            <BookingForm
              categories={home.categories}
              combos={home.combos}
              paymentConfig={home.paymentConfig}
            />
          </Suspense>
        </div>
      </section>

      <ContactSection contact={home.contact} />
    </>
  );
}
