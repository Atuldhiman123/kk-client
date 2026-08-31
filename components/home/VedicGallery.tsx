import React from 'react';

export function VedicGallery() {
  const practices = [
    {
      title: 'Vedic Yajna & Havan',
      subtitle: 'Planetary Shanti Pujas',
      description: 'Remedial Pujas and havans conducted by authentic Vedic priests to pacify negative planetary influences and bring positive vibrations.',
      image: '/images/puja.jpg',
      badge: '🔥 Puja & Remedies',
    },
    {
      title: 'Dhyana & Meditation',
      subtitle: 'Spiritual Peace',
      description: 'Achieve emotional balance, mental clarity, and spiritual alignment through personalized meditation guidance and Vedic mantras.',
      image: '/images/meditation.jpg',
      badge: '🧘 Meditation',
    },
    {
      title: 'Holy Prayers & Aarti',
      subtitle: 'Planetary Prayers',
      description: 'Devotional prayers and special archanas performed at holy shrines to strengthen beneficial planets in your horoscope.',
      image: '/images/aarti.jpg',
      badge: '🕉️ Devotion',
    },
    {
      title: 'Global Vedic Consultation',
      subtitle: 'Serving Seekers Globally',
      description: 'Offering accurate online consultation, custom gemstones, and remedy guidance to clients across India, USA, UK, UAE, and worldwide.',
      image: '/images/globe.jpg',
      badge: '🌐 Global Reach',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-[#FFF8E1]/40 via-[#FFFDF9] to-orange-50/20 py-12 sm:py-20 border-t border-orange-200/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <span className="rounded-full bg-orange-600/10 px-3.5 sm:px-4 py-1 sm:py-1.5 text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
            ✨ Vedic Traditions
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 font-serif">
            Divine Practices &amp; Guidance
          </h2>
          <p className="mt-2.5 sm:mt-3 max-w-2xl mx-auto text-sm sm:text-base text-neutral-700 font-medium">
            Rooted in pure Vedic traditions, our consultations and remedies help you align with cosmic energies for a prosperous life.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {practices.map((practice) => (
            <div
              key={practice.title}
              className="group flex flex-col justify-between rounded-3xl border border-orange-200/80 bg-[#FFFDF9] overflow-hidden shadow-xs transition duration-200 hover:-translate-y-1 hover:border-orange-400 hover:shadow-md"
            >
              <div className="relative h-40 sm:h-48 w-full overflow-hidden bg-orange-50">
                <img
                  src={practice.image}
                  alt={practice.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 rounded-full bg-orange-600 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                  {practice.badge}
                </span>
              </div>
              <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-orange-650">
                    {practice.subtitle}
                  </div>
                  <h3 className="mt-1 text-base font-bold text-neutral-900 group-hover:text-orange-700 transition font-serif">
                    {practice.title}
                  </h3>
                  <p className="mt-1.5 sm:mt-2 text-xs leading-relaxed text-neutral-600 font-medium">
                    {practice.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
