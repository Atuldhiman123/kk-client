import { Alert, Form, type FormInstance } from 'antd';
import type { Dayjs } from 'dayjs';
import type { ComboOffer, ConsultationCategory } from '@/lib/types';
import { formatInr } from '@/lib/format';

interface Props {
  form: FormInstance;
  categories: ConsultationCategory[];
  combos: ComboOffer[];
  error: string | null;
}

export function ConfirmationStep({ form, categories, combos, error }: Props) {
  const values = Form.useWatch([], form) as
    | {
        name?: string;
        phone?: string;
        email?: string;
        selection?: string;
        bookingDate?: Dayjs;
        slot?: string;
      }
    | undefined;

  const selectedCategory = values?.selection?.startsWith('category:')
    ? categories.find((c) => c.id === values.selection?.split(':')[1])
    : undefined;
  const selectedCombo = values?.selection?.startsWith('combo:')
    ? combos.find((c) => c.id === values.selection?.split(':')[1])
    : undefined;

  const rows: [string, string][] = [
    ['Name', values?.name ?? '-'],
    ['Phone', values?.phone ?? '-'],
    ['Consultation', selectedCategory?.name ?? (selectedCombo ? `${selectedCombo.name} (Combo)` : '-')],
    ['Date', values?.bookingDate ? values.bookingDate.format('DD MMM YYYY') : '-'],
    ['Time', values?.slot ?? '-'],
    [
      'Amount',
      formatInr(selectedCategory ? selectedCategory.price : (selectedCombo?.discountedPrice ?? 0)),
    ],
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-neutral-200">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between border-b border-neutral-100 px-4 py-3 last:border-0">
            <span className="text-sm text-neutral-500">{label}</span>
            <span className="text-sm font-medium text-neutral-900">{value}</span>
          </div>
        ))}
      </div>

      {error && <Alert type="error" message={error} showIcon />}

      <p className="text-xs text-neutral-500">
        By submitting, you confirm the above details are correct. Our team will contact you via
        Call/WhatsApp to confirm your consultation.
      </p>
    </div>
  );
}
