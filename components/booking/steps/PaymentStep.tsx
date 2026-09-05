'use client';

import { useState } from 'react';
import { App, Form, Input, Radio, Upload, type FormInstance, type UploadFile, type UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { uploadFile } from '@/lib/api';
import type { PaymentConfig } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';

interface Props {
  form: FormInstance;
  paymentConfig: PaymentConfig | null;
}

export function PaymentStep({ form, paymentConfig }: Props) {
  const { message } = App.useApp();
  const { t } = useLanguage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [method, setMethod] = useState<'UPI' | 'Razorpay'>('UPI');

  const customRequest: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      const res = await uploadFile(file as File);
      form.setFieldValue('paymentScreenshot', res.fileUrl);
      form.validateFields(['paymentScreenshot']).catch(() => undefined);
      onSuccess?.(res);
    } catch (err) {
      message.error(t.common.error_occurred);
      onError?.(err as Error);
    }
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length === 0) {
      form.setFieldValue('paymentScreenshot', undefined);
    }
  };

  return (
    <div className="space-y-2.5">
      <Form.Item name="paymentMethod" initialValue="UPI" label={t.booking.payment_method_label} required className="!mb-2">
        <Radio.Group
          onChange={(e) => {
            setMethod(e.target.value);
            form.setFieldValue('paymentMethod', e.target.value);
          }}
          className="w-full flex gap-1.5"
        >
          <Radio.Button value="UPI" className="flex-1 text-center font-semibold py-1 h-auto text-xs !rounded-xl">
            {t.booking.payment_upi}
          </Radio.Button>
          <Radio.Button value="Razorpay" className="flex-1 text-center font-semibold py-1 h-auto text-xs !rounded-xl">
            {t.booking.payment_razorpay}
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      {method === 'Razorpay' ? (
        <div className="rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/30 p-3 sm:p-5 text-center">
          <div className="text-2xl mb-1">💳</div>
          <h4 className="font-semibold text-neutral-800 text-xs sm:text-sm">{t.booking.razorpay_title}</h4>
          <p className="text-[11px] text-neutral-500 mt-0.5 max-w-xs mx-auto leading-tight">
            {t.booking.razorpay_desc}
          </p>
        </div>
      ) : (
        <>
          {!paymentConfig ? (
            <p className="text-xs text-red-600">
              {t.booking.payment_unconfigured}
            </p>
          ) : (
            <>
              <div className="rounded-xl border border-neutral-200 p-2.5 sm:p-3.5 bg-white">
                <div className="flex flex-col items-center gap-2.5 sm:flex-row sm:items-start text-center sm:text-left">
                  {paymentConfig.qrImage && (
                    <Image
                      src={paymentConfig.qrImage}
                      alt="Payment QR code"
                      width={110}
                      height={110}
                      className="rounded-lg border border-neutral-200 shrink-0"
                      unoptimized
                    />
                  )}
                  <div className="text-xs text-neutral-700 space-y-0.5">
                    <div>
                      <span className="font-semibold text-neutral-900">{t.booking.upi_name}</span> {paymentConfig.upiName}
                    </div>
                    <div className="break-all">
                      <span className="font-semibold text-neutral-900">{t.booking.upi_id}</span> {paymentConfig.upiId}
                    </div>
                    {paymentConfig.phone && (
                      <div>
                        <span className="font-semibold text-neutral-900">{t.booking.contact_label}</span> {paymentConfig.phone}
                      </div>
                    )}
                    {paymentConfig.instructions && (
                      <p className="mt-1 text-[10px] text-neutral-500 leading-tight">{paymentConfig.instructions}</p>
                    )}
                  </div>
                </div>
              </div>

              <Form.Item label={t.booking.transaction_id} name="transactionId">
                <Input placeholder={t.booking.transaction_id_placeholder} size="middle" className="!rounded-xl" />
              </Form.Item>

              <Form.Item label={t.booking.upload_screenshot} required>
                <Upload.Dragger
                  accept="image/png,image/jpeg,image/webp"
                  maxCount={1}
                  fileList={fileList}
                  onChange={handleChange}
                  customRequest={customRequest}
                  className="!rounded-xl !p-2"
                >
                  <p className="ant-upload-drag-icon !mb-1">
                    <InboxOutlined className="text-xl text-orange-600" />
                  </p>
                  <p className="ant-upload-text text-xs font-semibold">
                    {t.booking.upload_click_drag}
                  </p>
                  <p className="ant-upload-hint text-[10px]">{t.booking.upload_hint}</p>
                </Upload.Dragger>
              </Form.Item>
            </>
          )}
        </>
      )}

      <Form.Item
        name="paymentScreenshot"
        rules={[
          {
            validator: (_, value) => {
              if (method === 'UPI' && !value) {
                return Promise.reject(new Error(t.booking.screenshot_required));
              }
              return Promise.resolve();
            },
          },
        ]}
        className="!hidden"
      >
        <Input type="hidden" />
      </Form.Item>
    </div>
  );
}
