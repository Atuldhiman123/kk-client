'use client';

import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { BookingForm } from './BookingForm';
import type { ComboOffer, ConsultationCategory, PaymentConfig } from '../../lib/types';

interface Props {
  categories: ConsultationCategory[];
  combos: ComboOffer[];
  paymentConfig: PaymentConfig | null;
}

export function BookingModal({ categories, combos, paymentConfig }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href') || '';
        // Intercept any link pointing to #booking or containing /#booking
        if (href.includes('#booking')) {
          e.preventDefault();
          setIsOpen(true);
          
          let categorySlug = '';
          if (href.includes('category=')) {
            categorySlug = href.split('category=')[1].split('#')[0];
          }
          if (categorySlug) {
            setTimeout(() => {
              const event = new CustomEvent('select-booking-category', { detail: { categorySlug } });
              window.dispatchEvent(event);
            }, 150);
          }
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
      width="100%"
      style={{ maxWidth: 680, margin: '12px auto' }}
      destroyOnClose
      centered
      className="booking-modal"
      modalRender={(node) => (
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-orange-300/60 bg-[#FFFDF9] shadow-2xl p-0.5 sm:p-1.5">
          {/* Subtle cosmic decorative backgrounds */}
          <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-orange-500/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-red-500/10 blur-xl pointer-events-none" />
          
          {node}
        </div>
      )}
    >
      <div className="p-0 sm:p-1 max-h-[88vh] overflow-y-auto scrollbar-thin">
        <BookingForm
          categories={categories}
          combos={combos}
          paymentConfig={paymentConfig}
          isModal
        />
      </div>
    </Modal>
  );
}
