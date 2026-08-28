'use client';

import { useEffect, useState } from 'react';
import { DatePicker, Form, Radio, Spin, type FormInstance } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { getAvailability } from '@/lib/api';

export function SlotStep({ form }: { form: FormInstance }) {
  const bookingDate = Form.useWatch('bookingDate', form) as Dayjs | undefined;
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingDate) {
      return;
    }

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-param-change pattern
    setLoading(true);
    setError(null);
    form.setFieldValue('slot', undefined);

    getAvailability(bookingDate.format('YYYY-MM-DD'))
      .then((res) => {
        if (!cancelled) setSlots(res.slots);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load slots. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingDate?.format('YYYY-MM-DD')]);

  return (
    <div className="space-y-4">
      <Form.Item
        label="Select Date"
        name="bookingDate"
        rules={[{ required: true, message: 'Please select a date' }]}
      >
        <DatePicker
          className="w-full"
          size="large"
          format="DD-MM-YYYY"
          disabledDate={(date) => date.isBefore(dayjs().startOf('day'))}
        />
      </Form.Item>

      {bookingDate && (
        <Form.Item
          label="Available Time Slots"
          name="slot"
          rules={[{ required: true, message: 'Please select a time slot' }]}
        >
          {loading ? (
            <Spin size="small" />
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-neutral-550">
              No slots available on this date. Please choose another date.
            </p>
          ) : (
            <Radio.Group className="w-full">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.map((slot) => (
                  <Radio.Button key={slot} value={slot} className="!text-center">
                    {slot}
                  </Radio.Button>
                ))}
              </div>
            </Radio.Group>
          )}
        </Form.Item>
      )}
    </div>
  );
}
