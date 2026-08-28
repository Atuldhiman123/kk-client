'use client';

import { useEffect, useState } from 'react';
import { App, Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Switch, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, PoweroffOutlined, PlusOutlined } from '@ant-design/icons';
import {
  createAdminComboOffer,
  deleteAdminComboOffer,
  getAdminCategories,
  getAdminComboOffers,
  updateAdminComboOffer,
  type ComboOfferPayload,
} from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import type { ComboOffer, ConsultationCategory } from '@/lib/types';
import { formatInr } from '@/lib/format';

export default function AdminComboOffersPage() {
  const [combos, setCombos] = useState<ComboOffer[]>([]);
  const [categories, setCategories] = useState<ConsultationCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ComboOffer | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm<ComboOfferPayload>();
  const { message } = App.useApp();

  const load = () => {
    setLoading(true);
    Promise.all([getAdminComboOffers(), getAdminCategories()])
      .then(([comboRes, categoryRes]) => {
        setCombos(comboRes);
        setCategories(categoryRes);
      })
      .catch((err) => message.error(err instanceof ApiError ? err.message : 'Failed to load combo offers'))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- fetch-on-mount pattern
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (combo: ComboOffer) => {
    setEditing(combo);
    form.setFieldsValue({
      name: combo.name,
      slug: combo.slug,
      description: combo.description ?? undefined,
      discountedPrice: Number(combo.discountedPrice),
      categoryIds: combo.categories.map((c) => c.category.id),
      isActive: combo.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (editing) {
        await updateAdminComboOffer(editing.id, values);
        message.success('Combo offer updated');
      } else {
        await createAdminComboOffer(values);
        message.success('Combo offer created');
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
      await deleteAdminComboOffer(id);
      message.success('Combo offer deactivated');
      load();
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : 'Delete failed');
    }
  };

  const columns: ColumnsType<ComboOffer> = [
    { title: 'Name', dataIndex: 'name', className: 'font-semibold text-neutral-800' },
    {
      title: 'Included Categories',
      render: (_, record) => (
        <div className="flex flex-wrap gap-1.5">
          {record.categories.map((c) => (
            <Tag key={c.category.id} color="amber" className="font-semibold rounded-lg text-[10px] px-2 py-0.5">
              {c.category.name}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'discountedPrice',
      render: (v: string) => <span className="font-bold">{formatInr(v)}</span>,
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      render: (v: boolean) => (
        <Tag color={v ? 'success' : 'default'} className="font-bold rounded-lg px-2.5 py-0.5">
          {v ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <div className="flex gap-4">
          <button
            className="font-bold text-xs inline-flex items-center gap-1 hover:text-amber-800 transition"
            style={{ color: '#B8860B' }}
            onClick={() => openEdit(record)}
          >
            <EditOutlined className="text-xs" /> Edit
          </button>
          {record.isActive && (
            <Popconfirm title="Deactivate this combo?" onConfirm={() => handleDelete(record.id)}>
              <button className="font-bold text-xs text-red-600 inline-flex items-center gap-1 hover:text-red-700 transition">
                <PoweroffOutlined className="text-xs" /> Deactivate
              </button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Combo Offers</h1>
          <p className="text-xs text-neutral-500 font-medium">Create packages bundling multiple astrology sessions at a discount.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} className="h-10 rounded-xl font-bold">
          Add Combo Offer
        </Button>
      </div>

      <Table className="mt-6" rowKey="id" loading={loading} columns={columns} dataSource={combos} />

      <Modal
        title={editing ? 'Edit Combo Offer' : 'Add Combo Offer'}
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
          <Form.Item
            label="Included Categories"
            name="categoryIds"
            rules={[{ required: true, type: 'array', min: 2, message: 'Select at least 2 categories' }]}
          >
            <Select
              mode="multiple"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              placeholder="Select categories"
            />
          </Form.Item>
          <Form.Item label="Discounted Price (₹)" name="discountedPrice" rules={[{ required: true }]}>
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
