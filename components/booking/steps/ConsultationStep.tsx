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
                className="!h-auto w-full !rounded-xl !border !p-3 text-left"
              >
                <div className="font-medium text-neutral-900">{category.name}</div>
                <div className="text-xs text-neutral-500">
                  {category.durationMinutes} min &middot; {formatInr(category.price)}
                </div>
              </Radio.Button>
            ))}
            {combos.map((combo) => (
              <Radio.Button
                key={combo.id}
                value={`combo:${combo.id}`}
                className="!h-auto w-full !rounded-xl !border !p-3 text-left"
              >
                <div className="font-medium text-neutral-900">{combo.name} (Combo)</div>
                <div className="text-xs text-neutral-500">{formatInr(combo.discountedPrice)}</div>
              </Radio.Button>
            ))}
          </div>
        </Radio.Group>
      </Form.Item>

      {(selectedCategory || selectedCombo) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="font-semibold text-neutral-900">
            {selectedCategory?.name ?? `${selectedCombo?.name} (Combo)`}
          </div>
          <div className="mt-1 text-sm text-neutral-600">
            {selectedCategory && <>Duration: {selectedCategory.durationMinutes} minutes &middot; </>}
            Price: {formatInr(selectedCategory ? selectedCategory.price : (selectedCombo?.discountedPrice ?? 0))}
          </div>
        </div>
      )}
    </div>
  );
}
