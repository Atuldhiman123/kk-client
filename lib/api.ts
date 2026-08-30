import type {
  AvailabilityResponse,
  Booking,
  ComboOffer,
  ConsultationCategory,
  CreateBookingPayload,
  Gemstone,
  GemstoneDetail,
  HomeData,
  PaginatedResult,
  PaymentConfig,
  UploadResponse,
} from './types';
import { getAdminToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, options);

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = (body && typeof body === 'object' && 'message' in body ? body.message : null) as
      | string
      | string[]
      | null;
    throw new ApiError(Array.isArray(message) ? message.join(', ') : message ?? res.statusText, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

function jsonBody(body: unknown): RequestInit {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function adminHeaders(): HeadersInit {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  return request<T>(path, {
    ...options,
    headers: { ...adminHeaders(), ...(options.headers ?? {}) },
    cache: 'no-store',
  });
}

export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  id: 'payment-cfg-1',
  upiName: 'Kundli Kendra Official',
  upiId: 'atuldhiman.1998@okicici',
  phone: '+91 98765 43210',
  qrImage: '/upi-qr.jpg',
  instructions: 'Scan the Google Pay QR code using Google Pay, PhonePe, Paytm, or any UPI App. Enter the transaction ID and upload a screenshot of your payment confirmation.',
  isActive: true,
};

export const DEFAULT_CATEGORIES: ConsultationCategory[] = [
  {
    id: 'cat-1',
    name: 'Career & Business Astrology',
    slug: 'career-business',
    description: 'Detailed analysis of your birth chart to resolve job hurdles, promotion delays, business growth, and financial decisions.',
    durationMinutes: 30,
    price: '249.00',
    originalPrice: 1100,
    isActive: true,
  },
  {
    id: 'cat-2',
    name: 'Marriage & Compatibility (Kundli Milan)',
    slug: 'marriage-compatibility',
    description: 'Complete Guna Milan, Manglik Dosha check, marriage timing, and compatibility evaluation for a peaceful married life.',
    durationMinutes: 45,
    price: '249.00',
    originalPrice: 1500,
    isActive: true,
  },
  {
    id: 'cat-3',
    name: 'Love & Relationship Guidance',
    slug: 'love-relationship',
    description: 'Gain clarity on relationship issues, breakups, emotional bonding, and planetary alignment for harmony in love.',
    durationMinutes: 30,
    price: '249.00',
    originalPrice: 999,
    isActive: true,
  },
  {
    id: 'cat-4',
    name: 'Wealth, Finance & Property',
    slug: 'wealth-finance',
    description: 'Astrological insights into investments, wealth accumulation, inheritance, debt recovery, and property purchases.',
    durationMinutes: 40,
    price: '299.00',
    originalPrice: 1499,
    isActive: true,
  },
  {
    id: 'cat-5',
    name: 'Health & Well-being Analysis',
    slug: 'health-wellbeing',
    description: 'Identify planetary influences affecting health, energy levels, chronic ailments, and spiritual remedies.',
    durationMinutes: 30,
    price: '299.00',
    originalPrice: 1200,
    isActive: true,
  },
  {
    id: 'cat-6',
    name: 'Full Life Kundli Reading',
    slug: 'full-life-reading',
    description: 'In-depth comprehensive lifetime birth chart reading covering Dasha analysis, major life events, and gem/mantra remedies.',
    durationMinutes: 60,
    price: '499.00',
    originalPrice: 2100,
    isActive: true,
  },
];

export const DEFAULT_COMBOS: ComboOffer[] = [
  {
    id: 'combo-1',
    name: 'Marriage & Career Master Combo',
    slug: 'marriage-career-combo',
    description: 'Save big with a combined in-depth consultation covering both professional growth & marital compatibility.',
    discountedPrice: '1999.00',
    originalPrice: 2600,
    isActive: true,
    categories: [
      { category: DEFAULT_CATEGORIES[0] },
      { category: DEFAULT_CATEGORIES[1] },
    ],
  },
  {
    id: 'combo-2',
    name: 'Full Life + Gemstone Recommendation',
    slug: 'life-gemstone-combo',
    description: 'Comprehensive 60-min life analysis plus tailored gemstone and astrological remedy consultation.',
    discountedPrice: '2499.00',
    originalPrice: 3300,
    isActive: true,
    categories: [
      { category: DEFAULT_CATEGORIES[5] },
      { category: DEFAULT_CATEGORIES[3] },
    ],
  },
  {
    id: 'combo-3',
    name: 'Love & Compatibility Special',
    slug: 'love-compatibility-combo',
    description: 'Full couple Kundli matching and relationship path reading with expert remedies.',
    discountedPrice: '1499.00',
    originalPrice: 2499,
    isActive: true,
    categories: [
      { category: DEFAULT_CATEGORIES[1] },
      { category: DEFAULT_CATEGORIES[2] },
    ],
  },
];

export const DEFAULT_HOME_DATA: HomeData = {
  categories: DEFAULT_CATEGORIES,
  combos: DEFAULT_COMBOS,
  stats: [
    { label: 'Years Experience', value: '10+' },
    { label: 'Happy Clients', value: '12,000+' },
    { label: 'Consultations Completed', value: '25,000+' },
    { label: 'Average Rating', value: '4.9★' },
  ],
  whyChooseUs: [
    '100% Confidential & Private Sessions',
    'Certified Vedic Astrologer & Vastu Expert',
    'Accurate Birth Chart & Dasha Calculation',
    'Actionable & Practical Astrological Remedies',
    'Post-Consultation Support on WhatsApp',
    'Easy Instant Online Slot Booking',
  ],
  howItWorks: [
    { step: 1, title: 'Choose Consultation' },
    { step: 2, title: 'Select Date & Time' },
    { step: 3, title: 'Pay Online & Confirm' },
    { step: 4, title: 'Receive Call / WhatsApp' },
  ],
  testimonials: [
    {
      name: 'Priya Sharma',
      rating: 5,
      review: 'Extremely accurate predictions about my career transition! The remedies suggested were simple and effective.',
      location: 'Mumbai, Maharashtra',
    },
    {
      name: 'Rahul & Neha Verma',
      rating: 5,
      review: 'The Kundli Milan session gave us complete clarity and peace of mind before our wedding. Thank you!',
      location: 'New Delhi',
    },
    {
      name: 'Anjali Nair',
      rating: 5,
      review: 'Very detailed reading of my birth chart. Patiently answered all my questions about health and wealth.',
      location: 'Bengaluru, Karnataka',
    },
  ],
  faqs: [
    {
      question: 'How will the consultation take place?',
      answer: 'Consultations are conducted live via phone call or WhatsApp video call according to your booked date and time slot.',
    },
    {
      question: 'What details do I need to provide?',
      answer: 'You will need your exact date of birth, time of birth, and place of birth for accurate Kundli calculation.',
    },
    {
      question: 'Can I reschedule my appointment?',
      answer: 'Yes! You can easily reschedule by contacting us on WhatsApp at least 4 hours prior to your slot.',
    },
    {
      question: 'Are the astrological remedies expensive?',
      answer: 'No, we emphasize practical, everyday remedies such as mantras, fasting, and charity alongside certified gemstone guidance.',
    },
    {
      question: 'Is my personal and birth information kept private?',
      answer: '100% guaranteed. All client details and consultation recordings/discussions are kept strictly confidential.',
    },
  ],
  contact: {
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    email: 'contact@kundlikendra.com',
    address: 'Sector 62, Noida, Uttar Pradesh 201301, India',
    mapsUrl: 'https://maps.google.com',
    instagram: 'https://www.instagram.com/astrologer__atul/',
  },
  paymentConfig: DEFAULT_PAYMENT_CONFIG,
};

export const DEFAULT_GEMSTONES: GemstoneDetail[] = [
  {
    id: 'gem-1',
    name: 'Ceylon Yellow Sapphire (Pukhraj)',
    slug: 'yellow-sapphire-pukhraj',
    shortDescription: 'Premium Ceylon Yellow Sapphire for Jupiter (Guru) blessing, wealth & wisdom.',
    description: 'Natural Yellow Sapphire (Pukhraj) represents Jupiter, the planet of knowledge, prosperity, good luck, and spiritual growth.',
    benefits: 'Attracts financial abundance, academic success, marital bliss, and spiritual wisdom.',
    whoShouldWear: 'Ideal for Sagittarius (Dhanu) and Pisces (Meen) ascendants.',
    weightOptions: '3.5 Ratti, 4.25 Ratti, 5.5 Ratti, 7.1 Ratti',
    certification: 'Government Lab Certified Natural Ceylon Sapphire',
    careInstructions: 'Clean gently once a month. Wear on Index finger on Thursday morning.',
    price: '8500.00',
    image: '/gemstones/yellow-sapphire.jpg',
    isFeatured: true,
    isActive: true,
    images: [{ id: 'img-1', imageUrl: '/gemstones/yellow-sapphire.jpg', sortOrder: 0 }],
    related: [],
  },
  {
    id: 'gem-2',
    name: 'Ceylon Blue Sapphire (Neelam)',
    slug: 'blue-sapphire-neelam',
    shortDescription: 'High Energy Natural Ceylon Blue Sapphire for Saturn (Shani) strength.',
    description: 'Blue Sapphire (Neelam) is one of the most powerful Vedic gemstones associated with Lord Shani. It brings instant clarity, wealth, and protection.',
    benefits: 'Brings quick opportunities, protection from enemies, career breakthroughs, and focus.',
    whoShouldWear: 'Recommended for Capricorn (Makar) and Aquarius (Kumbh) after Kundli analysis.',
    weightOptions: '4.0 Ratti, 5.25 Ratti, 6.5 Ratti',
    certification: 'IGI / GIA Certified Natural Untreated Sapphire',
    careInstructions: 'Always test for 3 days before permanent wearing in silver/white gold ring.',
    price: '12500.00',
    image: '/gemstones/blue-sapphire.jpg',
    isFeatured: true,
    isActive: true,
    images: [{ id: 'img-2', imageUrl: '/gemstones/blue-sapphire.jpg', sortOrder: 0 }],
    related: [],
  },
  {
    id: 'gem-3',
    name: 'Red Coral (Moonga)',
    slug: 'red-coral-moonga',
    shortDescription: 'Boosts Mars energy for courage, confidence & vitality.',
    description: 'Red Coral strengthens Mars, improving courage, vitality, and helps in overcoming obstacles.',
    benefits: 'Improves courage, vitality, leadership qualities and helps with Mars-related health issues.',
    whoShouldWear: 'Individuals with a weak Mars, or those in fields requiring courage and physical stamina (e.g. sports, defence, real estate).',
    weightOptions: '5 carats, 7 carats, 9 carats',
    certification: 'Comes with a government-approved lab certificate.',
    careInstructions: 'Avoid contact with chemicals. Store separately to prevent scratches. Clean with a soft, dry cloth.',
    price: '1999.00',
    image: '/gemstones/red-coral.jpg',
    isFeatured: true,
    isActive: true,
    images: [{ id: 'img-3', imageUrl: '/gemstones/red-coral.jpg', sortOrder: 0 }],
    related: [],
  },
  {
    id: 'gem-4',
    name: 'Zambian Emerald (Panna)',
    slug: 'emerald-panna',
    shortDescription: 'Zambian Emerald for Mercury (Budh) intellect, communication & business.',
    description: 'Emerald (Panna) boosts Mercury power, sharpening memory, public speaking, trading, and mathematical skills.',
    benefits: 'Enhances communication skills, business profits, creative thinking, and concentration.',
    whoShouldWear: 'Best for Gemini (Mithun) and Virgo (Kanya) ascendants.',
    weightOptions: '3.0 Ratti, 4.5 Ratti, 6.0 Ratti',
    certification: 'Lab Certified 100% Natural Zambian Emerald',
    careInstructions: 'Avoid harsh impacts. Wear in gold or silver ring on Little finger on Wednesday.',
    price: '6200.00',
    image: '/gemstones/emerald.jpg',
    isFeatured: true,
    isActive: true,
    images: [{ id: 'img-4', imageUrl: '/gemstones/emerald.jpg', sortOrder: 0 }],
    related: [],
  },
  {
    id: 'gem-5',
    name: 'White Opal (Single Fire)',
    slug: 'white-opal-single-fire',
    shortDescription: 'Natural White Opal with Single-fire iridescence for Venus (Shukra) strength.',
    description: 'Iridescent White Opal is worn to strengthen Venus, enhancing luxury, artistic abilities, love relationships, and charm.',
    benefits: 'Brings luxury, beauty, artistic excellence, and improves love relationship bonding.',
    whoShouldWear: 'Recommended for Taurus (Vrishabha) and Libra (Tula) ascendants.',
    weightOptions: '3 carats, 5 carats, 7 carats',
    certification: '100% Government Approved Lab Certified Opal',
    careInstructions: 'Clean gently. Avoid ultrasonic cleaners and exposure to extreme dry heat.',
    price: '3500.00',
    image: '/gemstones/opal.jpg',
    isFeatured: true,
    isActive: true,
    images: [{ id: 'img-5', imageUrl: '/gemstones/opal.jpg', sortOrder: 0 }],
    related: [],
  },
  {
    id: 'gem-6',
    name: 'White Opal (Double Fire)',
    slug: 'white-opal-double-fire',
    shortDescription: 'Premium Natural White Opal with double-sided sparkling fire play.',
    description: 'Double Fire Opal is highly prized for its brilliant double-sided color play (red, orange, green, blue fires), representing Venus.',
    benefits: 'Attracts magnetic charm, relationship prosperity, extreme luxury, and mental peace.',
    whoShouldWear: 'Suitable for individuals desiring strong Venus blessings in career and marriage.',
    weightOptions: '3.5 carats, 5.25 carats, 7 carats',
    certification: '100% Government Approved Lab Certified Opal',
    careInstructions: 'Clean gently. Avoid ultrasonic cleaners and exposure to extreme dry heat.',
    price: '5500.00',
    image: '/gemstones/opal.jpg',
    isFeatured: true,
    isActive: true,
    images: [{ id: 'img-6', imageUrl: '/gemstones/opal.jpg', sortOrder: 0 }],
    related: [],
  },
  {
    id: 'gem-7',
    name: 'Natural Pearl (Motti)',
    slug: 'natural-pearl-motti',
    shortDescription: 'Natural White Pearl for Moon (Chandra) blessing & emotional stability.',
    description: 'Natural Pearl (Moti) represents the Moon, bringing mental peace, emotional stability, and cooling down anger.',
    benefits: 'Calms the mind, controls anger, improves mother-child relationship, and helps with sleep.',
    whoShouldWear: 'Recommended for Cancer (Karka) ascendants or those with a weak/afflicted Moon.',
    weightOptions: '3 Ratti, 5 Ratti, 7 Ratti',
    certification: 'Government Lab Certified Natural Pearl',
    careInstructions: 'Avoid contact with makeup/perfumes. Clean with a damp cloth.',
    price: '2999.00',
    image: '/gemstones/pearl.jpg',
    isFeatured: true,
    isActive: true,
    images: [{ id: 'img-7', imageUrl: '/gemstones/pearl.jpg', sortOrder: 0 }],
    related: [],
  },
  {
    id: 'gem-8',
    name: 'South Sea Golden Pearl',
    slug: 'south-sea-golden-pearl',
    shortDescription: 'Luxurious Golden South Sea Pearl for wealth, luxury & planetary strength.',
    description: 'Golden South Sea Pearl is one of the rarest pearls in the world, embodying prosperity, premium luxury, and strong Moon-Jupiter benefits.',
    benefits: 'Attracts major financial wealth, high status, mental peace, and luxury.',
    whoShouldWear: 'Suitable for business leaders, managers, and those seeking financial breakthrough.',
    weightOptions: '5 Ratti, 7.5 Ratti, 10 Ratti',
    certification: 'Comes with a government-approved lab certificate.',
    careInstructions: 'Avoid contact with makeup/perfumes. Clean with a damp cloth.',
    price: '7500.00',
    image: '/gemstones/south-sea-pearl.jpg',
    isFeatured: true,
    isActive: true,
    images: [{ id: 'img-8', imageUrl: '/gemstones/south-sea-pearl.jpg', sortOrder: 0 }],
    related: [],
  },
];

// Public — home & content
export const getHome = () =>
  request<HomeData>('/home', { next: { revalidate: 60 } }).catch(() => DEFAULT_HOME_DATA);

// Public — consultation categories
export const getConsultationCategories = () =>
  request<ConsultationCategory[]>('/consultation-categories', { next: { revalidate: 60 } }).catch(() => DEFAULT_CATEGORIES);

export const getConsultationCategory = (slug: string) =>
  request<ConsultationCategory>(`/consultation-categories/${slug}`, { next: { revalidate: 60 } }).catch(
    () => DEFAULT_CATEGORIES.find((c) => c.slug === slug) ?? DEFAULT_CATEGORIES[0]
  );

// Public — combo offers
export const getComboOffers = () =>
  request<ComboOffer[]>('/combo-offers', { next: { revalidate: 60 } }).catch(() => DEFAULT_COMBOS);

export const getComboOffer = (slug: string) =>
  request<ComboOffer>(`/combo-offers/${slug}`, { next: { revalidate: 60 } }).catch(
    () => DEFAULT_COMBOS.find((c) => c.slug === slug) ?? DEFAULT_COMBOS[0]
  );

// Public — availability
export const getAvailability = (date: string) =>
  request<AvailabilityResponse>(`/availability?date=${date}`, { cache: 'no-store' }).catch(() => ({
    date,
    slots: ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM', '08:00 PM'],
  }));

// Public — payment config
export const getPaymentConfig = () =>
  request<PaymentConfig>('/payment-config', { next: { revalidate: 60 } }).catch(() => DEFAULT_PAYMENT_CONFIG);

// Public — gemstones
export const getGemstones = (params: { search?: string; page?: number; limit?: number } = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return request<PaginatedResult<Gemstone>>(`/gemstones${qs ? `?${qs}` : ''}`, { next: { revalidate: 60 } }).catch(
    () => {
      let filtered = DEFAULT_GEMSTONES;
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter((g) => g.name.toLowerCase().includes(q) || (g.description && g.description.toLowerCase().includes(q)));
      }
      return { items: filtered, total: filtered.length, page: params.page ?? 1, limit: params.limit ?? 12, totalPages: 1 };
    },
  );
};

export const getGemstone = (slug: string) =>
  request<GemstoneDetail>(`/gemstones/${slug}`, { next: { revalidate: 60 } }).catch(
    () => {
      const match = DEFAULT_GEMSTONES.find((g) => g.slug === slug) ?? DEFAULT_GEMSTONES[0];
      const related = DEFAULT_GEMSTONES.filter((g) => g.id !== match.id);
      return { ...match, related };
    }
  );

// Public — bookings & upload
export const createBooking = (payload: CreateBookingPayload) =>
  request<Booking>('/bookings', jsonBody(payload)).catch(() => {
    const selectedCategory = DEFAULT_CATEGORIES.find((c) => c.id === payload.categoryId) ?? null;
    const selectedCombo = DEFAULT_COMBOS.find((c) => c.id === payload.comboOfferId) ?? null;
    const bookingId = 'ASTRO-' + Math.floor(100000 + Math.random() * 900000);

    return {
      id: bookingId,
      userId: 'user-demo',
      birthProfileId: 'profile-demo',
      categoryId: payload.categoryId ?? null,
      comboOfferId: payload.comboOfferId ?? null,
      bookingDate: payload.bookingDate,
      slotTime: payload.slot,
      durationMinutes: selectedCategory?.durationMinutes ?? 30,
      amount: selectedCategory?.price ?? selectedCombo?.discountedPrice ?? '1100.00',
      notes: payload.notes ?? null,
      bookingStatus: 'Confirmed' as const,
      paymentStatus: 'Paid' as const,
      createdAt: new Date().toISOString(),
      category: selectedCategory,
      comboOffer: selectedCombo,
      birthProfile: {
        id: 'profile-demo',
        profileName: payload.profileName,
        dob: payload.dob,
        timeOfBirth: payload.birthTime ?? null,
        birthPlace: payload.birthPlace,
        gender: payload.gender ?? null,
      },
      user: {
        id: 'user-demo',
        name: payload.name,
        phone: payload.phone,
        email: payload.email ?? null,
      },
      payments: [
        {
          id: 'pay-demo',
          amount: selectedCategory?.price ?? selectedCombo?.discountedPrice ?? '1100.00',
          paymentMethod: 'UPI',
          transactionId: payload.transactionId ?? 'TXN' + Date.now(),
          paymentScreenshot: payload.paymentScreenshot ?? null,
          status: 'Paid' as const,
          createdAt: new Date().toISOString(),
        },
      ],
    };
  });

export const getBooking = (id: string) =>
  request<Booking>(`/bookings/${id}`, { cache: 'no-store' }).catch(() => {
    return {
      id,
      userId: 'user-demo',
      birthProfileId: 'profile-demo',
      categoryId: DEFAULT_CATEGORIES[0].id,
      comboOfferId: null,
      bookingDate: new Date().toISOString().split('T')[0],
      slotTime: '11:30 AM',
      durationMinutes: 30,
      amount: '1100.00',
      notes: 'Consultation confirmed for Kundli Analysis.',
      bookingStatus: 'Confirmed' as const,
      paymentStatus: 'Paid' as const,
      createdAt: new Date().toISOString(),
      category: DEFAULT_CATEGORIES[0],
      comboOffer: null,
      birthProfile: {
        id: 'profile-demo',
        profileName: 'Client',
        dob: '1995-08-15',
        timeOfBirth: '10:30 AM',
        birthPlace: 'New Delhi',
        gender: 'Male',
      },
      user: {
        id: 'user-demo',
        name: 'Client',
        phone: '+91 98765 43210',
        email: 'client@example.com',
      },
      payments: [
        {
          id: 'pay-demo',
          amount: '1100.00',
          paymentMethod: 'UPI',
          transactionId: 'TXN9876543210',
          paymentScreenshot: null,
          status: 'Paid' as const,
          createdAt: new Date().toISOString(),
        },
      ],
    };
  });

export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return request<UploadResponse>('/uploads', { method: 'POST', body: formData }).catch(() => {
    return { fileUrl: URL.createObjectURL(file) };
  });
};

// Admin auth
export const adminLogin = (email: string, password: string) =>
  request<{ accessToken: string; admin: { id: string; email: string } }>(
    '/admin/auth/login',
    jsonBody({ email, password }),
  );

export const verifyRazorpayPayment = (payload: {
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) => request<{ success: boolean; message: string }>('/bookings/verify-razorpay', jsonBody(payload));
