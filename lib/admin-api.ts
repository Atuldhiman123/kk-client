import { adminRequest } from './api';
import type {
  Booking,
  BookingStatus,
  ComboOffer,
  ConsultationCategory,
  Gemstone,
  PaginatedResult,
  PaymentConfig,
  PaymentStatus,
  WeeklyAvailability,
} from './types';

function jsonBody(method: string, body: unknown) {
  return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

// Bookings
export interface AdminBookingsQuery {
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
  date?: string;
  page?: number;
  limit?: number;
}

export const getAdminBookings = (query: AdminBookingsQuery = {}) => {
  const params = new URLSearchParams();
  if (query.bookingStatus) params.set('bookingStatus', query.bookingStatus);
  if (query.paymentStatus) params.set('paymentStatus', query.paymentStatus);
  if (query.date) params.set('date', query.date);
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  const qs = params.toString();
  return adminRequest<PaginatedResult<Booking>>(`/admin/bookings${qs ? `?${qs}` : ''}`);
};

export const getAdminBooking = (id: string) => adminRequest<Booking>(`/admin/bookings/${id}`);

export const updateAdminBookingStatus = (
  id: string,
  data: { bookingStatus?: BookingStatus; paymentStatus?: PaymentStatus },
) => adminRequest<Booking>(`/admin/bookings/${id}/status`, jsonBody('PATCH', data));

// Consultation categories
export type CategoryPayload = {
  name: string;
  slug: string;
  description?: string;
  durationMinutes: number;
  price: number;
  isActive?: boolean;
};

export const getAdminCategories = () => adminRequest<ConsultationCategory[]>('/admin/categories');
export const createAdminCategory = (data: CategoryPayload) =>
  adminRequest<ConsultationCategory>('/admin/categories', jsonBody('POST', data));
export const updateAdminCategory = (id: string, data: Partial<CategoryPayload>) =>
  adminRequest<ConsultationCategory>(`/admin/categories/${id}`, jsonBody('PATCH', data));
export const deleteAdminCategory = (id: string) =>
  adminRequest<{ success: boolean }>(`/admin/categories/${id}`, { method: 'DELETE' });

// Combo offers
export type ComboOfferPayload = {
  name: string;
  slug: string;
  description?: string;
  discountedPrice: number;
  categoryIds: string[];
  isActive?: boolean;
};

export const getAdminComboOffers = () => adminRequest<ComboOffer[]>('/admin/combo-offers');
export const createAdminComboOffer = (data: ComboOfferPayload) =>
  adminRequest<ComboOffer>('/admin/combo-offers', jsonBody('POST', data));
export const updateAdminComboOffer = (id: string, data: Partial<ComboOfferPayload>) =>
  adminRequest<ComboOffer>(`/admin/combo-offers/${id}`, jsonBody('PATCH', data));
export const deleteAdminComboOffer = (id: string) =>
  adminRequest<{ success: boolean }>(`/admin/combo-offers/${id}`, { method: 'DELETE' });

// Gemstones
export type GemstonePayload = {
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  benefits?: string;
  whoShouldWear?: string;
  weightOptions?: string;
  certification?: string;
  careInstructions?: string;
  price: number;
  image?: string;
  images?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
};

export const getAdminGemstones = () => adminRequest<Gemstone[]>('/admin/gemstones');
export const createAdminGemstone = (data: GemstonePayload) =>
  adminRequest<Gemstone>('/admin/gemstones', jsonBody('POST', data));
export const updateAdminGemstone = (id: string, data: Partial<GemstonePayload>) =>
  adminRequest<Gemstone>(`/admin/gemstones/${id}`, jsonBody('PATCH', data));
export const deleteAdminGemstone = (id: string) =>
  adminRequest<{ success: boolean }>(`/admin/gemstones/${id}`, { method: 'DELETE' });

// Weekly availability
export type AvailabilityPayload = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
};

export const getAdminAvailability = () => adminRequest<WeeklyAvailability[]>('/admin/availability');
export const createAdminAvailability = (data: AvailabilityPayload) =>
  adminRequest<WeeklyAvailability>('/admin/availability', jsonBody('POST', data));
export const updateAdminAvailability = (id: string, data: Partial<AvailabilityPayload>) =>
  adminRequest<WeeklyAvailability>(`/admin/availability/${id}`, jsonBody('PATCH', data));
export const deleteAdminAvailability = (id: string) =>
  adminRequest<{ success: boolean }>(`/admin/availability/${id}`, { method: 'DELETE' });

// Payment config
export type PaymentConfigPayload = {
  upiName: string;
  upiId: string;
  phone?: string;
  qrImage?: string;
  instructions?: string;
  isActive?: boolean;
};

export const getAdminPaymentConfig = () => adminRequest<PaymentConfig | null>('/admin/payment-config');
export const upsertAdminPaymentConfig = (data: PaymentConfigPayload) =>
  adminRequest<PaymentConfig>('/admin/payment-config', jsonBody('PUT', data));
