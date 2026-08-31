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
    <div className="space-y-2.5">
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50/50">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between items-center border-b border-neutral-200/60 px-3 py-1.5 sm:py-2.5 last:border-0 text-xs sm:text-sm">
            <span className="text-neutral-500 font-medium">{label}</span>
            <span className="font-semibold text-neutral-900 text-right truncate max-w-[60%]">{value}</span>
          </div>
        ))}
      </div>

      {error && <Alert type="error" message={error} showIcon className="!rounded-xl !py-1.5 !text-xs" />}

      <p className="text-[10px] sm:text-xs text-neutral-500 leading-tight">
        By submitting, you confirm details are correct. Our team will contact you via Call/WhatsApp.
      </p>
    </div>
  );
}
