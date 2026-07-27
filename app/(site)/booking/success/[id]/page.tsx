import { notFound } from 'next/navigation';
import dayjs from 'dayjs';
import { ApiError, getBooking, getHome } from '@/lib/api';
import { formatInr } from '@/lib/format';
import { telLink, waLink } from '@/lib/contact';

export const metadata = {
  title: 'Booking Confirmed | Kundli Kendra',
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Paid: 'bg-green-100 text-green-800',
  Failed: 'bg-red-100 text-red-800',
};

export default async function BookingSuccessPage(props: PageProps<'/booking/success/[id]'>) {
  const { id } = await props.params;

  const [booking, home] = await Promise.all([
    getBooking(id).catch((err) => {
      if (err instanceof ApiError && err.status === 404) return null;
      throw err;
    }),
    getHome().catch(() => null),
  ]);

  if (!booking) {
    notFound();
  }

  const consultationName = booking.category?.name ?? (booking.comboOffer ? `${booking.comboOffer.name} (Combo)` : '-');
  const contact = home?.contact;
  const paymentStatus = booking.payments[0]?.status ?? booking.paymentStatus;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✅
        </div>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Booking Submitted Successfully!</h1>
        <p className="mt-2 text-neutral-600">
          Thank you, {booking.user.name}. Our team will contact you shortly via Call or WhatsApp to
          confirm your consultation.
        </p>

        <div className="mt-8 overflow-hidden rounded-xl border border-neutral-200 text-left">
          {[
            ['Booking ID', booking.id],
            ['Consultation', consultationName],
            ['Date', dayjs(booking.bookingDate).format('DD MMM YYYY')],
            ['Time', booking.slotTime],
            ['Amount', formatInr(booking.amount)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-neutral-100 px-4 py-3 last:border-0">
              <span className="text-sm text-neutral-500">{label}</span>
              <span className="text-sm font-medium text-neutral-900">{value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-neutral-500">Payment Status</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                PAYMENT_STATUS_STYLES[paymentStatus] ?? 'bg-neutral-100 text-neutral-700'
              }`}
            >
              {paymentStatus}
            </span>
          </div>
        </div>

        {contact && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={waLink(contact.whatsapp, `Hi, I just booked a consultation (Booking ID: ${booking.id}).`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: '#25D366' }}
            >
              <span aria-hidden>💬</span> WhatsApp Us
            </a>
            <a
              href={telLink(contact.phone)}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-800"
            >
              <span aria-hidden>📞</span> Call Now
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
