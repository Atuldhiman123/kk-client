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

const FALLBACK_HOME: HomeData = {
  categories: [],
  combos: [],
  stats: [
    { label: 'Years Experience', value: '10+' },
    { label: 'Happy Clients', value: '5,000+' },
    { label: 'Consultations Completed', value: '8,000+' },
    { label: 'Average Rating', value: '4.9★' },
  ],
  whyChooseUs: [
    'Personalized Kundli Analysis',
    'Accurate Predictions',
    'Confidential Consultation',
    'Years of Practical Experience',
  ],
  howItWorks: [
    { step: 1, title: 'Choose Consultation' },
    { step: 2, title: 'Select Date & Time' },
    { step: 3, title: 'Pay Online' },
    { step: 4, title: 'Receive Consultation' },
  ],
  testimonials: [],
  faqs: [],
  contact: {
    phone: '+91 93171 17001',
    whatsapp: '+91 93171 17001',
    email: 'kundlikendra1998@gmail.com',
    address: 'Office Address, City, State, India',
    mapsUrl: 'https://maps.google.com',
  },
  paymentConfig: null,
};

// Public — home & content
export const getHome = () =>
  request<HomeData>('/home', { next: { revalidate: 60 } }).catch(() => FALLBACK_HOME);

// Public — consultation categories
export const getConsultationCategories = () =>
  request<ConsultationCategory[]>('/consultation-categories', { next: { revalidate: 60 } }).catch(() => []);

export const getConsultationCategory = (slug: string) =>
  request<ConsultationCategory>(`/consultation-categories/${slug}`, { next: { revalidate: 60 } });

// Public — combo offers
export const getComboOffers = () =>
  request<ComboOffer[]>('/combo-offers', { next: { revalidate: 60 } }).catch(() => []);

export const getComboOffer = (slug: string) =>
  request<ComboOffer>(`/combo-offers/${slug}`, { next: { revalidate: 60 } });

// Public — availability
export const getAvailability = (date: string) =>
  request<AvailabilityResponse>(`/availability?date=${date}`, { cache: 'no-store' });

// Public — payment config
export const getPaymentConfig = () =>
  request<PaymentConfig>('/payment-config', { next: { revalidate: 60 } }).catch(() => null);

// Public — gemstones
export const getGemstones = (params: { search?: string; page?: number; limit?: number } = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return request<PaginatedResult<Gemstone>>(`/gemstones${qs ? `?${qs}` : ''}`, { next: { revalidate: 60 } }).catch(
    () => ({ data: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } }),
  );
};

export const getGemstone = (slug: string) =>
  request<GemstoneDetail>(`/gemstones/${slug}`, { next: { revalidate: 60 } });

// Public — bookings & upload
export const createBooking = (payload: CreateBookingPayload) => request<Booking>('/bookings', jsonBody(payload));

export const getBooking = (id: string) => request<Booking>(`/bookings/${id}`, { cache: 'no-store' });

export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return request<UploadResponse>('/uploads', { method: 'POST', body: formData });
};

export const verifyRazorpayPayment = (payload: {
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) => request<{ success: boolean; message: string }>('/bookings/verify-razorpay', jsonBody(payload));

// Admin auth
export const adminLogin = (email: string, password: string) =>
  request<{ accessToken: string; admin: { id: string; email: string } }>(
    '/admin/auth/login',
    jsonBody({ email, password }),
  );
