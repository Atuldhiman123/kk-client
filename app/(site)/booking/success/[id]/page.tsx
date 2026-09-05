import { notFound } from 'next/navigation';
import { ApiError, getBooking, getHome } from '@/lib/api';
import { BookingSuccessClient } from '@/components/booking/BookingSuccessClient';

export const metadata = {
  title: 'Booking Confirmed | Kundli Kendra',
};

export default async function BookingSuccessPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const [booking, home] = await Promise.all([
    getBooking(id).catch((err) => {
      if (err instanceof ApiError && err.status === 404) return null;
      throw err;
    }),
    getHome(),
  ]);

  if (!booking) {
    notFound();
  }

  return <BookingSuccessClient booking={booking} contact={home.contact} />;
}
