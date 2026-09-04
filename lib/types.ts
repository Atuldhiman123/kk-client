export interface ConsultationCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  durationMinutes: number;
  price: string;
  originalPrice?: number;
  isActive: boolean;
}

export interface ComboOfferCategoryEntry {
  category: ConsultationCategory;
}

export interface ComboOffer {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  discountedPrice: string;
  isActive: boolean;
  categories: ComboOfferCategoryEntry[];
  originalPrice: number;
}

export interface GemstoneImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

export interface Gemstone {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  benefits: string | null;
  whoShouldWear: string | null;
  weightOptions: string | null;
  certification: string | null;
  careInstructions: string | null;
  price: string;
  image: string | null;
  isFeatured: boolean;
  isActive: boolean;
  images: GemstoneImage[];
}

export interface GemstoneDetail extends Gemstone {
  related: Gemstone[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Stat {
  label: string;
  value: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
}

export interface Testimonial {
  name: string;
  rating: number;
  review: string;
  location?: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapsUrl: string;
  instagram?: string;
}

export interface PaymentConfig {
  id: string;
  upiName: string;
  upiId: string;
  phone: string | null;
  qrImage: string | null;
  instructions: string | null;
  isActive: boolean;
}

export interface HomeData {
  categories: ConsultationCategory[];
  combos: ComboOffer[];
  stats: Stat[];
  whyChooseUs: string[];
  howItWorks: HowItWorksStep[];
  testimonials: Testimonial[];
  faqs: Faq[];
  contact: ContactInfo;
  paymentConfig: PaymentConfig | null;
}

export interface AvailabilityResponse {
  date: string;
  slots: string[];
}

export interface BirthProfile {
  id: string;
  profileName: string;
  dob: string;
  timeOfBirth: string | null;
  birthPlace: string;
  gender: string | null;
}

export interface BookingUser {
  id: string;
  name: string;
  phone: string;
  email: string | null;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';

export interface BookingPayment {
  id: string;
  amount: string;
  paymentMethod: string;
  transactionId: string | null;
  paymentScreenshot: string | null;
  status: PaymentStatus;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  birthProfileId: string;
  categoryId: string | null;
  comboOfferId: string | null;
  bookingDate: string;
  slotTime: string;
  durationMinutes: number;
  amount: string;
  notes: string | null;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  category: ConsultationCategory | null;
  comboOffer: ComboOffer | null;
  birthProfile: BirthProfile;
  user: BookingUser;
  payments: BookingPayment[];
}

export interface CreateBookingPayload {
  name: string;
  phone: string;
  email?: string;
  profileName: string;
  dob: string;
  birthTime?: string;
  birthPlace: string;
  gender?: string;
  categoryId?: string;
  comboOfferId?: string;
  bookingDate: string;
  slot: string;
  notes?: string;
  paymentMethod?: string;
  transactionId?: string;
  paymentScreenshot?: string;
}

export interface UploadResponse {
  fileUrl: string;
}

export interface WeeklyAvailability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface BirthDetailsPayload {
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:mm
  latitude: number;
  longitude: number;
  timezone?: number;
}

export interface AiChatPayload {
  message: string;
  conversationId?: string;
  birthDetails?: BirthDetailsPayload;
}

export interface AiChatResponse {
  conversationId: string;
  message: string;
  usedBirthChart: boolean;
}

export interface AstrologyChartResponse {
  birthDetails: {
    dateOfBirth: string;
    timeOfBirth: string;
    latitude: number;
    longitude: number;
    timezone: number;
  };
  ascendant: {
    sign: string;
    signDegree: number;
    totalDegree: number;
    nakshatra: string;
    nakshatraLord: string;
    pada: number;
    house: number;
  };
  planets: Array<{
    name: string;
    sign: string;
    signDegree: number;
    totalDegree: number;
    house: number;
    nakshatra: string;
    nakshatraLord: string;
    pada: number;
    isRetrograde: boolean;
  }>;
  houses: Array<{
    house: number;
    sign: string;
    cuspDegree: number;
    signLord: string;
    subLord?: string;
  }>;
  dashas: {
    mahadashas: Array<{
      planet: string;
      startDate: string;
      endDate: string;
      antardashas?: Array<{
        planet: string;
        startDate: string;
        endDate: string;
      }>;
    }>;
    currentMahadasha?: {
      planet: string;
      startDate: string;
      endDate: string;
    };
  };
}

