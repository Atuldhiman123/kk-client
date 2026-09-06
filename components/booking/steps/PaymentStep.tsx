'use client';

import React, { useState, useEffect } from 'react';
import { App, Form, Input, Radio, Upload, Tag, Collapse, type FormInstance, type UploadFile, type UploadProps } from 'antd';
import {
  InboxOutlined,
  SafetyCertificateFilled,
  ThunderboltFilled,
  CreditCardOutlined,
  QrcodeOutlined,
  CheckCircleFilled,
  InfoCircleOutlined,
} from '@ant-design/icons';
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
  const { locale, t } = useLanguage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [method, setMethod] = useState<'Razorpay' | 'UPI'>('Razorpay');

  useEffect(() => {
    const current = form.getFieldValue('paymentMethod');
    if (!current) {
      form.setFieldValue('paymentMethod', 'Razorpay');
    } else {
      setMethod(current);
    }
  }, [form]);

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

  const handleMethodChange = (newMethod: 'Razorpay' | 'UPI') => {
    setMethod(newMethod);
    form.setFieldValue('paymentMethod', newMethod);
  };

  return (
    <div className="space-y-3">
      {/* Hidden/Controlled Form Item for submission */}
      <Form.Item name="paymentMethod" initialValue="Razorpay" className="!hidden">
        <Input type="hidden" />
      </Form.Item>

      {/* 1. Primary Method: Razorpay Online Instant Checkout */}
      <div
        onClick={() => handleMethodChange('Razorpay')}
        className={`relative rounded-2xl border-2 p-3 sm:p-4 text-left transition-all duration-200 select-none cursor-pointer ${
          method === 'Razorpay'
            ? 'border-orange-600 bg-orange-50/60 shadow-md ring-2 ring-orange-500/20'
            : 'border-orange-200/90 bg-white hover:border-orange-400 hover:bg-orange-50/20'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-lg ${
              method === 'Razorpay' ? 'bg-orange-600 text-white shadow-xs' : 'bg-orange-100 text-orange-800'
            }`}>
              <CreditCardOutlined />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900 leading-tight">
                  {locale === 'hi' ? 'ऑनलाइन भुगतान (तुरंत पुष्टि)' : 'Online Payment (Instant Confirmation)'}
                </h4>
                <Tag color="success" className="!mr-0 !px-1.5 !py-0 !rounded-full !text-[9.5px] !font-black border-0 shadow-2xs">
                  {locale === 'hi' ? 'अनुशंसित' : 'Recommended'}
                </Tag>
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                UPI (GPay / PhonePe / Paytm), Cards, NetBanking & Wallets
              </p>
            </div>
          </div>

          <div className="shrink-0 pt-0.5">
            <div className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
              method === 'Razorpay' ? 'border-orange-600 bg-orange-600 text-white text-xs' : 'border-neutral-300 bg-white'
            }`}>
              {method === 'Razorpay' && <CheckCircleFilled className="text-white text-xs" />}
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[10.5px] border-t border-orange-100/80 pt-2.5 text-neutral-700 font-medium">
          <div className="flex items-center gap-1.5 text-emerald-800">
            <ThunderboltFilled className="text-amber-500 text-xs shrink-0" />
            <span>{locale === 'hi' ? 'ऑटो स्लॉट कन्फर्मेशन' : 'Instant Slot Confirmation'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-700">
            <SafetyCertificateFilled className="text-emerald-600 text-xs shrink-0" />
            <span>{locale === 'hi' ? '256-बिट सुरक्षित भुगतान' : '100% Safe & Encrypted'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-700">
            <span className="text-xs shrink-0">⚡</span>
            <span>{locale === 'hi' ? 'रसीद व चालान उपलब्ध' : 'Instant Digital Receipt'}</span>
          </div>
        </div>
      </div>

      {/* 2. Fallback Option: Manual UPI QR Code Scan */}
      <div className="rounded-2xl border border-orange-200/80 bg-white p-2.5 sm:p-3 shadow-2xs">
        <div
          onClick={() => handleMethodChange('UPI')}
          className="flex items-center justify-between gap-2 cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-sm ${
              method === 'UPI' ? 'bg-orange-600 text-white shadow-xs' : 'bg-neutral-100 text-neutral-600'
            }`}>
              <QrcodeOutlined />
            </div>
            <div>
              <span className="font-bold text-xs text-neutral-800">
                {locale === 'hi' ? 'मैन्युअल UPI QR कोड (वैकल्पिक / Fallback)' : 'Manual UPI QR Code (Fallback)'}
              </span>
              <p className="text-[10px] text-neutral-400 leading-tight">
                {locale === 'hi' ? 'ऑनलाइन भुगतान में समस्या होने पर सीधे QR स्कैन करें' : 'Scan QR & upload screenshot if online payment fails'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Tag color="default" className="!mr-0 !px-1.5 !py-0 !rounded-full !text-[9px] !font-bold">
              Fallback
            </Tag>
            <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
              method === 'UPI' ? 'border-orange-600 bg-orange-600 text-white text-[10px]' : 'border-neutral-300 bg-white'
            }`}>
              {method === 'UPI' && <CheckCircleFilled className="text-white text-[10px]" />}
            </div>
          </div>
        </div>

        {/* Expanded Manual UPI section when selected */}
        {method === 'UPI' && (
          <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2.5">
            {!paymentConfig ? (
              <p className="text-xs text-red-600">{t.booking.payment_unconfigured}</p>
            ) : (
              <>
                <div className="rounded-xl border border-orange-200 bg-orange-50/40 p-2.5 sm:p-3">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                    {paymentConfig.qrImage && (
                      <Image
                        src={paymentConfig.qrImage}
                        alt="Payment QR code"
                        width={100}
                        height={100}
                        className="rounded-lg border border-neutral-200 shrink-0 shadow-xs"
                        unoptimized
                      />
                    )}
                    <div className="text-xs text-neutral-700 space-y-1">
                      <div>
                        <span className="font-bold text-neutral-900">{t.booking.upi_name}</span> {paymentConfig.upiName}
                      </div>
                      <div className="break-all">
                        <span className="font-bold text-neutral-900">{t.booking.upi_id}</span>{' '}
                        <code className="bg-white px-1.5 py-0.5 rounded border text-[11px] font-mono font-bold text-orange-950">
                          {paymentConfig.upiId}
                        </code>
                      </div>
                      {paymentConfig.phone && (
                        <div>
                          <span className="font-bold text-neutral-900">{t.booking.contact_label}</span> {paymentConfig.phone}
                        </div>
                      )}
                      {paymentConfig.instructions && (
                        <p className="mt-1 text-[10px] text-neutral-500 leading-tight">{paymentConfig.instructions}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <Form.Item label={t.booking.transaction_id} name="transactionId" className="!mb-1">
                    <Input placeholder={t.booking.transaction_id_placeholder} size="middle" className="!rounded-xl" />
                  </Form.Item>

                  <Form.Item label={t.booking.upload_screenshot} required className="!mb-0">
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
                      <p className="ant-upload-text text-xs font-semibold">{t.booking.upload_click_drag}</p>
                      <p className="ant-upload-hint text-[10px]">{t.booking.upload_hint}</p>
                    </Upload.Dragger>
                  </Form.Item>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Hidden validation validator for screenshot when in UPI mode */}
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
