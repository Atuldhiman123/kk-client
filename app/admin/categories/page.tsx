'use client';

import { useEffect, useState } from 'react';
import { App, Button, Form, Input, InputNumber, Modal, Popconfirm, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
  type CategoryPayload,
} from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import type { ConsultationCategory } from '@/lib/types';
import { formatInr } from '@/lib/format';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ConsultationCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ConsultationCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm<CategoryPayload>();
  const { message } = App.useApp();

  const load = () => {
    setLoading(true);
    getAdminCategories()
      .then(setCategories)
      .catch((err) => message.error(err instanceof ApiError ? err.message : 'Failed to load categories'))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- fetch-on-mount pattern
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (category: ConsultationCategory) => {
    setEditing(category);
    form.setFieldsValue({
      name: category.name,
      slug: category.slug,
      description: category.description ?? undefined,
      durationMinutes: category.durationMinutes,
      price: Number(category.price),
      isActive: category.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (editing) {
        await updateAdminCategory(editing.id, values);
        message.success('Category updated');
      } else {
        await createAdminCategory(values);
        message.success('Category created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminCategory(id);
      message.success('Category deactivated');
      load();
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : 'Delete failed');
    }
  };

  const columns: ColumnsType<ConsultationCategory> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Slug', dataIndex: 'slug' },
    { title: 'Duration', dataIndex: 'durationMinutes', render: (v: number) => `${v} min` },
    { title: 'Price', dataIndex: 'price', render: (v: string) => formatInr(v) },
    { title: 'Active', dataIndex: 'isActive', render: (v: boolean) => (v ? 'Yes' : 'No') },
    {
      title: '',
      render: (_, record) => (
        <div className="flex gap-3">
          <button className="font-medium" style={{ color: '#B8860B' }} onClick={() => openEdit(record)}>
            Edit
          </button>
          <Popconfirm title="Deactivate this category?" onConfirm={() => handleDelete(record.id)}>
            <button className="font-medium text-red-600">Deactivate</button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">Consultation Categories</h1>
        <Button type="primary" onClick={openCreate}>
          Add Category
        </Button>
      </div>

      <Table className="mt-6" rowKey="id" loading={loading} columns={columns} dataSource={categories} />

      <Modal
        title={editing ? 'Edit Category' : 'Add Category'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={saving}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Duration (minutes)" name="durationMinutes" rules={[{ required: true }]}>
            <InputNumber min={1} className="w-full" />
          </Form.Item>
          <Form.Item label="Price (₹)" name="price" rules={[{ required: true }]}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item label="Active" name="isActive" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
