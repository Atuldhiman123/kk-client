import { Form, Radio, type FormInstance } from 'antd';
import type { ComboOffer, ConsultationCategory } from '@/lib/types';
import { formatInr } from '@/lib/format';

interface Props {
  form: FormInstance;
  categories: ConsultationCategory[];
  combos: ComboOffer[];
}

export function ConsultationStep({ form, categories, combos }: Props) {
  const selection = Form.useWatch('selection', form) as string | undefined;

  const selectedCategory = selection?.startsWith('category:')
    ? categories.find((c) => c.id === selection.split(':')[1])
    : undefined;
  const selectedCombo = selection?.startsWith('combo:')
    ? combos.find((c) => c.id === selection.split(':')[1])
    : undefined;

  return (
    <div className="space-y-4">
      <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
        ✨ Select Consultation Session
      </div>

      <Form.Item
        name="selection"
        rules={[{ required: true, message: 'Please select a consultation or combo offer' }]}
      >
        <Radio.Group className="w-full">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {categories.map((category) => (
              <Radio.Button
                key={category.id}
                value={`category:${category.id}`}
                className="!h-auto w-full !rounded-2xl !border-amber-200 !p-4 text-left shadow-2xs hover:!border-amber-400"
              >
                <div className="flex items-start justify-between">
                  <div className="font-bold text-neutral-900">{category.name}</div>
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-extrabold text-red-700">
                    OFFER
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-2 text-xs">
                  <span className="font-extrabold text-neutral-900 text-sm">{formatInr(category.price)}</span>
                  {category.originalPrice && (
                    <span className="text-neutral-400 line-through">{formatInr(category.originalPrice)}</span>
                  )}
                  <span className="text-neutral-500 font-medium ml-auto">{category.durationMinutes} min</span>
                </div>
              </Radio.Button>
            ))}
            {combos.map((combo) => (
              <Radio.Button
                key={combo.id}
                value={`combo:${combo.id}`}
                className="!h-auto w-full !rounded-2xl !border-amber-300 !p-4 text-left shadow-2xs hover:!border-amber-500"
              >
                <div className="flex items-start justify-between">
                  <div className="font-bold text-neutral-900">{combo.name} (Combo)</div>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">
                    SPECIAL COMBO
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-2 text-xs">
                  <span className="font-extrabold text-neutral-900 text-sm">{formatInr(combo.discountedPrice)}</span>
                  <span className="text-neutral-400 line-through">{formatInr(combo.originalPrice)}</span>
                </div>
              </Radio.Button>
            ))}
          </div>
        </Radio.Group>
      </Form.Item>

      {(selectedCategory || selectedCombo) && (
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/40 p-4">
          <div className="flex items-center justify-between">
            <div className="font-bold text-neutral-900">
              {selectedCategory?.name ?? `${selectedCombo?.name} (Combo)`}
            </div>
            <div className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              🏷️ Offer Applied
            </div>
          </div>
          <div className="mt-1 text-sm font-semibold text-neutral-700">
            Final Price:{' '}
            <span className="text-base font-extrabold text-neutral-900">
              {formatInr(selectedCategory ? selectedCategory.price : (selectedCombo?.discountedPrice ?? 0))}
            </span>
            {selectedCategory && (
              <span className="text-xs text-neutral-500 font-normal"> &middot; {selectedCategory.durationMinutes} min session</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
