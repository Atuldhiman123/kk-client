'use client';

import { useEffect, useState } from 'react';
import { App, Button, Form, Input, Spin, Switch, Upload, type UploadFile, type UploadProps } from 'antd';
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
      <h1 className="text-xl font-bold text-neutral-900">Payment Configuration</h1>

      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        className="mt-6"
        onFinish={handleSubmit}
        initialValues={{ isActive: true }}
      >
        <Form.Item label="UPI Name" name="upiName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="UPI ID" name="upiId" rules={[{ required: true }]}>
          <Input placeholder="example@upi" />
        </Form.Item>
        <Form.Item label="Contact Phone" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Payment Instructions" name="instructions">
          <Input.TextArea rows={3} />
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

        <Form.Item label="Active" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={saving}>
          Save
        </Button>
      </Form>
    </div>
  );
}
