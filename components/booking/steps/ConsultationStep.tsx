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
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-orange-900">
        <span className="flex items-center gap-1.5">🔮 Select Consultation Session</span>
        <span className="text-[10px] text-neutral-400 font-medium normal-case sm:hidden">Swipe to explore &rarr;</span>
      </div>

      {/* Horizontal Carousel with Optimized Card Sizes & High-Contrast Selected State */}
      <div className="flex gap-2.5 sm:gap-3.5 overflow-x-auto pb-2 pt-1 px-1 -mx-1 snap-x snap-mandatory scrollbar-thin">
        {categories.map((category) => {
          const isSelected = selection === `category:${category.id}`;
          return (
            <div
              key={category.id}
              onClick={() => {
                form.setFieldValue('selection', `category:${category.id}`);
                form.validateFields(['selection']).catch(() => {});
              }}
              className={`relative flex flex-col justify-between cursor-pointer rounded-2xl border-2 p-3 text-left transition-all duration-200 select-none w-[70vw] max-w-[230px] sm:w-56 shrink-0 snap-start ${
                isSelected
                  ? 'border-orange-600 bg-gradient-to-br from-orange-50 via-amber-50/40 to-orange-100/30 shadow-md ring-2 ring-orange-500/20 scale-[1.01]'
                  : 'border-orange-200/80 bg-[#FFFDF9] hover:border-orange-400 hover:bg-orange-50/20 shadow-2xs'
              }`}
            >
              {/* Header: Title & Badges */}
              <div>
                <div className="flex items-start justify-between gap-1.5">
                  <div className={`font-bold text-xs sm:text-sm leading-snug line-clamp-1 ${
                    isSelected ? 'text-orange-950 font-black' : 'text-neutral-900'
                  }`}>
                    {category.name}
                  </div>
                  {isSelected ? (
                    <span className="shrink-0 rounded-full bg-orange-600 px-2 py-0.5 text-[8.5px] font-black text-white shadow-2xs">
                      ✓ Active
                    </span>
                  ) : (
                    <span className="shrink-0 rounded bg-orange-100/80 px-1.5 py-0.2 text-[8px] font-bold text-orange-800 uppercase">
                      Popular
                    </span>
                  )}
                </div>

                {category.description && (
                  <p className="mt-1 text-[9.5px] sm:text-[10.5px] text-neutral-600 leading-tight line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Footer: Price & Duration */}
              <div className="mt-2.5 flex items-center justify-between border-t border-orange-200/60 pt-2 text-[10px]">
                <div className="flex items-baseline gap-1">
                  <span className={`font-black text-xs sm:text-sm ${isSelected ? 'text-orange-600' : 'text-neutral-900'}`}>
                    {formatInr(category.price)}
                  </span>
                  {category.originalPrice && (
                    <span className="text-neutral-400 line-through text-[9px]">{formatInr(category.originalPrice)}</span>
                  )}
                </div>
                <span className={`font-bold rounded-full px-1.5 py-0.5 text-[8.5px] flex items-center gap-0.5 ${
                  isSelected ? 'bg-orange-200/80 text-orange-950' : 'bg-neutral-100 text-neutral-600'
                }`}>
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
              className={`relative flex flex-col justify-between cursor-pointer rounded-2xl border-2 p-3 text-left transition-all duration-200 select-none w-[70vw] max-w-[230px] sm:w-56 shrink-0 snap-start ${
                isSelected
                  ? 'border-orange-600 bg-gradient-to-br from-orange-50 via-amber-50/40 to-orange-100/30 shadow-md ring-2 ring-orange-500/20 scale-[1.01]'
                  : 'border-orange-200/80 bg-[#FFFDF9] hover:border-orange-400 hover:bg-orange-50/20 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1.5">
                  <div className={`font-bold text-xs sm:text-sm leading-snug line-clamp-1 ${
                    isSelected ? 'text-orange-950 font-black' : 'text-neutral-900'
                  }`}>
                    {combo.name}
                  </div>
                  {isSelected ? (
                    <span className="shrink-0 rounded-full bg-orange-600 px-2 py-0.5 text-[8.5px] font-black text-white shadow-2xs">
                      ✓ Active
                    </span>
                  ) : (
                    <span className="shrink-0 rounded bg-red-100/80 px-1.5 py-0.2 text-[8px] font-bold text-red-700 uppercase">
                      Combo
                    </span>
                  )}
                </div>

                {combo.description && (
                  <p className="mt-1 text-[9.5px] sm:text-[10.5px] text-neutral-600 leading-tight line-clamp-2">
                    {combo.description}
                  </p>
                )}
              </div>

              <div className="mt-2.5 flex items-center justify-between border-t border-orange-200/60 pt-2 text-[10px]">
                <div className="flex items-baseline gap-1">
                  <span className={`font-black text-xs sm:text-sm ${isSelected ? 'text-orange-600' : 'text-neutral-900'}`}>
                    {formatInr(combo.discountedPrice)}
                  </span>
                  <span className="text-neutral-400 line-through text-[9px]">{formatInr(combo.originalPrice)}</span>
                </div>
                <span className="bg-red-100 text-red-800 font-bold rounded-full px-1.5 py-0.5 text-[8.5px]">
                  Discounted
                </span>
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

      {/* Selected Session Pill Indicator */}
      {(selectedCategory || selectedCombo) && (
        <div className="rounded-xl border border-orange-300/80 bg-gradient-to-r from-orange-50 via-amber-50/40 to-orange-100/30 px-3 py-2 flex items-center justify-between shadow-2xs mt-1">
          <div className="text-[11px] sm:text-xs font-bold text-orange-950 flex items-center gap-1.5 truncate">
            <span className="text-orange-600">🎯</span>
            <span className="truncate">{selectedCategory?.name ?? `${selectedCombo?.name} (Combo)`}</span>
          </div>
          <div className="shrink-0 text-xs sm:text-sm font-black text-neutral-900 ml-2">
            {formatInr(selectedCategory ? selectedCategory.price : (selectedCombo?.discountedPrice ?? 0))}
          </div>
        </div>
      )}
    </div>
  );
}
