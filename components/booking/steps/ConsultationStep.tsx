import { Form, type FormInstance } from 'antd';
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
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-orange-700">
        <span className="flex items-center gap-1.5">🔮 Select Consultation Session</span>
      </div>

      <div className="flex gap-3.5 overflow-x-auto pb-4 pt-3 px-3.5 -mx-3.5 snap-x snap-mandatory scrollbar-thin">
        {categories.map((category) => {
          const isSelected = selection === `category:${category.id}`;
          return (
            <div
              key={category.id}
              onClick={() => {
                form.setFieldValue('selection', `category:${category.id}`);
                form.validateFields(['selection']).catch(() => {});
              }}
              className={`relative flex flex-col justify-between cursor-pointer rounded-2xl border-2 p-3.5 text-left transition-all duration-200 select-none w-56 sm:w-60 shrink-0 snap-start h-[125px] ${
                isSelected
                  ? 'border-orange-600 bg-orange-50/30 shadow-md ring-3 ring-orange-600/10 scale-[1.01]'
                  : 'border-orange-200 bg-[#FFFDF9] hover:border-orange-450 hover:shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white text-[10px] font-black shadow-md border-2 border-white">
                  ✓
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-1">
                  <div className={`font-bold text-xs leading-tight line-clamp-1 transition-colors ${isSelected ? 'text-orange-950' : 'text-neutral-900'}`}>
                    {category.name}
                  </div>
                  <span className="shrink-0 rounded bg-red-50 border border-red-200/50 px-1 py-0.2 text-[8px] font-extrabold text-red-600 uppercase tracking-wider">
                    Offer
                  </span>
                </div>
                {category.description && (
                  <p className="mt-1 text-[10px] text-neutral-500 leading-snug line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>

              <div className="mt-1.5 flex items-baseline justify-between border-t border-orange-100 pt-1.5 text-[10px]">
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-neutral-900 text-xs">{formatInr(category.price)}</span>
                  {category.originalPrice && (
                    <span className="text-neutral-400 line-through text-[9px]">{formatInr(category.originalPrice)}</span>
                  )}
                </div>
                <span className="text-neutral-500 font-bold bg-neutral-100/70 rounded px-1 py-0.2 text-[8.5px] flex items-center gap-0.5">
                  ⏱️ {category.durationMinutes}m
                </span>
              </div>
            </div>
          );
        })}

        {combos.map((combo) => {
          const isSelected = selection === `combo:${combo.id}`;
          return (
            <div
              key={combo.id}
              onClick={() => {
                form.setFieldValue('selection', `combo:${combo.id}`);
                form.validateFields(['selection']).catch(() => {});
              }}
              className={`relative flex flex-col justify-between cursor-pointer rounded-2xl border-2 p-3.5 text-left transition-all duration-200 select-none w-56 sm:w-60 shrink-0 snap-start h-[125px] ${
                isSelected
                  ? 'border-orange-600 bg-orange-50/30 shadow-md ring-3 ring-orange-600/10 scale-[1.01]'
                  : 'border-orange-200 bg-[#FFFDF9] hover:border-orange-450 hover:shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white text-[10px] font-black shadow-md border-2 border-white">
                  ✓
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-1">
                  <div className={`font-bold text-xs leading-tight line-clamp-1 transition-colors ${isSelected ? 'text-orange-950' : 'text-neutral-900'}`}>
                    {combo.name}
                  </div>
                  <span className="shrink-0 rounded bg-orange-50 border border-orange-200/50 px-1 py-0.2 text-[8px] font-extrabold text-orange-700 uppercase tracking-wider">
                    Combo
                  </span>
                </div>
                {combo.description && (
                  <p className="mt-1 text-[10px] text-neutral-500 leading-snug line-clamp-2">
                    {combo.description}
                  </p>
                )}
              </div>

              <div className="mt-1.5 flex items-baseline justify-between border-t border-orange-100 pt-1.5 text-[10px]">
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-neutral-900 text-xs">{formatInr(combo.discountedPrice)}</span>
                  <span className="text-neutral-400 line-through text-[9px]">{formatInr(combo.originalPrice)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hidden input for AntD validation */}
      <Form.Item
        name="selection"
        rules={[{ required: true, message: 'Please select a consultation or combo offer' }]}
        className="!hidden"
      >
        <input type="hidden" />
      </Form.Item>

      {(selectedCategory || selectedCombo) && (
        <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50/40 to-orange-100/10 p-4 mt-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="font-extrabold text-neutral-900 text-xs flex items-center gap-1.5">
              <span>🎯</span> Selected: {selectedCategory?.name ?? `${selectedCombo?.name} (Combo)`}
            </div>
            <div className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <span>🏷️</span> Offer Applied
            </div>
          </div>
          <div className="mt-2 text-xs font-semibold text-neutral-700 flex items-center gap-2">
            <span>Total Payable:</span>
            <span className="text-sm font-extrabold text-neutral-900">
              {formatInr(selectedCategory ? selectedCategory.price : (selectedCombo?.discountedPrice ?? 0))}
            </span>
            {selectedCategory && (
              <span className="text-[10px] text-neutral-500 font-normal"> &middot; {selectedCategory.durationMinutes} min session</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
