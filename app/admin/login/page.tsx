'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { App, Button, Form, Input } from 'antd';
import { ApiError, adminLogin } from '@/lib/api';
import { setAdminToken } from '@/lib/auth';

interface LoginValues {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { message } = App.useApp();

  const onFinish = async (values: LoginValues) => {
    setSubmitting(true);
    try {
      const res = await adminLogin(values.email, values.password);
      setAdminToken(res.accessToken);
      message.success('Logged in successfully');
      router.push('/admin/bookings');
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-center text-xl font-bold text-neutral-900">Admin Login</h1>
        <p className="mt-1 text-center text-sm text-neutral-500">Kundli Kendra Admin Panel</p>

        <Form layout="vertical" className="mt-6" onFinish={onFinish} requiredMark="optional">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }, { type: 'email' }]}
          >
            <Input size="large" placeholder="admin@example.com" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={submitting}>
            Log In
          </Button>
        </Form>
      </div>
    </div>
  );
}
