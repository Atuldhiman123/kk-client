'use client';

import { useEffect, useState } from 'react';
import { App, Button, Form, Input, Spin, Switch, Upload, Card, type UploadFile, type UploadProps } from 'antd';
import { CreditCardOutlined, UserOutlined, WalletOutlined, PhoneOutlined, SaveOutlined } from '@ant-design/icons';
import {
  getAdminPaymentConfig,
  upsertAdminPaymentConfig,
  type PaymentConfigPayload,
} from '@/lib/admin-api';
import { ApiError, uploadFile } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const toAbsolute = (url: string) => (url.startsWith('http') ? url : `${API_BASE_URL}${url}`);

export default function AdminPaymentConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qrImage, setQrImage] = useState<string | undefined>();
  const [form] = Form.useForm<PaymentConfigPayload>();
  const { message } = App.useApp();

  useEffect(() => {
    getAdminPaymentConfig()
      .then((config) => {
        if (config) {
          form.setFieldsValue({
            upiName: config.upiName,
            upiId: config.upiId,
            phone: config.phone ?? undefined,
            instructions: config.instructions ?? undefined,
            isActive: config.isActive,
          });
          setQrImage(config.qrImage ?? undefined);
        }
      })
      .catch((err) => message.error(err instanceof ApiError ? err.message : 'Failed to load payment config'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customRequest: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      const res = await uploadFile(file as File);
      setQrImage(res.fileUrl);
      onSuccess?.(res);
    } catch (err) {
      message.error('QR image upload failed');
      onError?.(err as Error);
    }
  };

  const handleSubmit = async (values: PaymentConfigPayload) => {
    setSaving(true);
    try {
      await upsertAdminPaymentConfig({ ...values, qrImage });
      message.success('Payment configuration saved');
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Payment Configuration</h1>
        <p className="text-xs text-neutral-500 font-medium">Manage UPI accounts, QR codes, and instruction guidelines for booking payments.</p>
      </div>

      <Card
        title={
          <span className="flex items-center gap-2 text-neutral-900 font-extrabold">
            <CreditCardOutlined className="text-amber-600" />
            <span>UPI Account Settings</span>
          </span>
        }
        className="shadow-2xs rounded-3xl border-neutral-200 mt-6"
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
          onFinish={handleSubmit}
          initialValues={{ isActive: true }}
        >
          <Form.Item label="UPI Holder Name" name="upiName" rules={[{ required: true, message: 'Please enter UPI holder name' }]}>
            <Input prefix={<UserOutlined className="text-neutral-400" />} placeholder="e.g. Atul Sharma" className="h-10" />
          </Form.Item>
          <Form.Item label="UPI ID" name="upiId" rules={[{ required: true, message: 'Please enter UPI ID' }]}>
            <Input prefix={<WalletOutlined className="text-neutral-400" />} placeholder="e.g. example@upi" className="h-10" />
          </Form.Item>
          <Form.Item label="Contact Phone" name="phone">
            <Input prefix={<PhoneOutlined className="text-neutral-400" />} placeholder="e.g. +91 9876543210" className="h-10" />
          </Form.Item>
          <Form.Item label="Payment Instructions" name="instructions">
            <Input.TextArea rows={3} placeholder="Provide scanning or transfer instructions for customers..." />
          </Form.Item>

          <Form.Item label="QR Code Image">
            <Upload
              listType="picture-card"
              fileList={
                qrImage
                  ? [{ uid: 'qr', name: 'qr', status: 'done', url: toAbsolute(qrImage) } as UploadFile]
                  : []
              }
              customRequest={customRequest}
              onRemove={() => setQrImage(undefined)}
              accept="image/png,image/jpeg,image/webp"
              maxCount={1}
            >
              {qrImage ? null : '+ Upload'}
            </Upload>
          </Form.Item>

          <Form.Item label="Payment Setup Active" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={saving} icon={<SaveOutlined />} className="h-10 rounded-xl font-bold px-6">
            Save Settings
          </Button>
        </Form>
      </Card>
    </div>
  );
}
