'use client';

import { useState } from 'react';
import { App, Form, Input, Upload, type FormInstance, type UploadFile, type UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { uploadFile } from '@/lib/api';
import type { PaymentConfig } from '@/lib/types';

interface Props {
  form: FormInstance;
  paymentConfig: PaymentConfig | null;
}

export function PaymentStep({ form, paymentConfig }: Props) {
  const { message } = App.useApp();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const customRequest: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      const res = await uploadFile(file as File);
      form.setFieldValue('paymentScreenshot', res.fileUrl);
      form.validateFields(['paymentScreenshot']).catch(() => undefined);
      onSuccess?.(res);
    } catch (err) {
      message.error('Upload failed, please try again');
      onError?.(err as Error);
    }
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length === 0) {
      form.setFieldValue('paymentScreenshot', undefined);
    }
  };

  if (!paymentConfig) {
    return (
      <p className="text-sm text-red-600">
        Payment details are not configured yet. Please contact us directly to complete your booking.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-neutral-200 p-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {paymentConfig.qrImage && (
            <Image
              src={paymentConfig.qrImage}
              alt="Payment QR code"
              width={160}
              height={160}
              className="rounded-lg border border-neutral-200"
              unoptimized
            />
          )}
          <div className="text-sm text-neutral-700">
            <div>
              <span className="font-semibold">UPI Name:</span> {paymentConfig.upiName}
            </div>
            <div>
              <span className="font-semibold">UPI ID:</span> {paymentConfig.upiId}
            </div>
            {paymentConfig.phone && (
              <div>
                <span className="font-semibold">Contact:</span> {paymentConfig.phone}
              </div>
            )}
            {paymentConfig.instructions && (
              <p className="mt-2 text-neutral-500">{paymentConfig.instructions}</p>
            )}
          </div>
        </div>
      </div>

      <Form.Item label="Transaction ID (Optional)" name="transactionId">
        <Input placeholder="UPI transaction / reference ID" size="large" />
      </Form.Item>

      <Form.Item label="Upload Payment Screenshot" required>
        <Upload.Dragger
          accept="image/png,image/jpeg,image/webp"
          maxCount={1}
          fileList={fileList}
          onChange={handleChange}
          customRequest={customRequest}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag payment screenshot to upload</p>
          <p className="ant-upload-hint">JPG, PNG or WEBP, up to 5MB</p>
        </Upload.Dragger>
      </Form.Item>

      <Form.Item name="paymentScreenshot" rules={[{ required: true, message: 'Please upload your payment screenshot' }]} className="!hidden">
        <Input type="hidden" />
      </Form.Item>
    </div>
  );
}
