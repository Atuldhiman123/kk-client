'use client';

import { useEffect, useState } from 'react';
import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Switch,
  Table,
  Upload,
  type UploadFile,
  type UploadProps,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  createAdminGemstone,
  deleteAdminGemstone,
  getAdminGemstones,
  updateAdminGemstone,
  type GemstonePayload,
} from '@/lib/admin-api';
import { ApiError, uploadFile } from '@/lib/api';
import type { Gemstone } from '@/lib/types';
import { formatInr } from '@/lib/format';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const toAbsolute = (url: string) => (url.startsWith('http') ? url : `${API_BASE_URL}${url}`);

export default function AdminGemstonesPage() {
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Gemstone | null>(null);
  const [saving, setSaving] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [form] = Form.useForm<GemstonePayload>();
  const { message } = App.useApp();

  const load = () => {
    setLoading(true);
    getAdminGemstones()
      .then(setGemstones)
      .catch((err) => message.error(err instanceof ApiError ? err.message : 'Failed to load gemstones'))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- fetch-on-mount pattern
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setFileList([]);
    setImageUrls([]);
    setModalOpen(true);
  };

  const openEdit = (gemstone: Gemstone) => {
    setEditing(gemstone);
    form.setFieldsValue({
      name: gemstone.name,
      slug: gemstone.slug,
      shortDescription: gemstone.shortDescription ?? undefined,
      description: gemstone.description ?? undefined,
      benefits: gemstone.benefits ?? undefined,
      whoShouldWear: gemstone.whoShouldWear ?? undefined,
      weightOptions: gemstone.weightOptions ?? undefined,
      certification: gemstone.certification ?? undefined,
      careInstructions: gemstone.careInstructions ?? undefined,
      price: Number(gemstone.price),
      isFeatured: gemstone.isFeatured,
      isActive: gemstone.isActive,
    });
    const existingUrls = gemstone.images.map((i) => i.imageUrl);
    setImageUrls(existingUrls);
    setFileList(
      existingUrls.map((url, index) => ({
        uid: String(index),
        name: `image-${index + 1}`,
        status: 'done',
        url: toAbsolute(url),
      })),
    );
    setModalOpen(true);
  };

  const customRequest: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      const res = await uploadFile(file as File);
      setImageUrls((prev) => [...prev, res.fileUrl]);
      onSuccess?.(res);
    } catch (err) {
      message.error('Image upload failed');
      onError?.(err as Error);
    }
  };

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length < fileList.length) {
      // an image was removed — rebuild imageUrls from what's left with a URL
      const remaining = newFileList
        .map((f) => f.response?.fileUrl ?? f.url)
        .filter((u): u is string => Boolean(u))
        .map((u) => (u.startsWith(API_BASE_URL) ? u.slice(API_BASE_URL.length) : u));
      setImageUrls(remaining);
    }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const payload = { ...values, images: imageUrls };
      if (editing) {
        await updateAdminGemstone(editing.id, payload);
        message.success('Gemstone updated');
      } else {
        await createAdminGemstone(payload);
        message.success('Gemstone created');
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
      await deleteAdminGemstone(id);
      message.success('Gemstone deactivated');
      load();
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : 'Delete failed');
    }
  };

  const columns: ColumnsType<Gemstone> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Price', dataIndex: 'price', render: (v: string) => formatInr(v) },
    { title: 'Featured', dataIndex: 'isFeatured', render: (v: boolean) => (v ? 'Yes' : 'No') },
    { title: 'Active', dataIndex: 'isActive', render: (v: boolean) => (v ? 'Yes' : 'No') },
    {
      title: '',
      render: (_, record) => (
        <div className="flex gap-3">
          <button className="font-medium" style={{ color: '#B8860B' }} onClick={() => openEdit(record)}>
            Edit
          </button>
          <Popconfirm title="Deactivate this gemstone?" onConfirm={() => handleDelete(record.id)}>
            <button className="font-medium text-red-600">Deactivate</button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">Gemstones</h1>
        <Button type="primary" onClick={openCreate}>
          Add Gemstone
        </Button>
      </div>

      <Table className="mt-6" rowKey="id" loading={loading} columns={columns} dataSource={gemstones} />

      <Modal
        title={editing ? 'Edit Gemstone' : 'Add Gemstone'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={saving}
        destroyOnHidden
        width={640}
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Short Description" name="shortDescription">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Benefits" name="benefits">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Who Should Wear" name="whoShouldWear">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Weight Options" name="weightOptions">
            <Input placeholder="e.g. 3 carats, 5 carats, 7 carats" />
          </Form.Item>
          <Form.Item label="Certification" name="certification">
            <Input />
          </Form.Item>
          <Form.Item label="Care Instructions" name="careInstructions">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Price (₹)" name="price" rules={[{ required: true }]}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item label="Images">
            <Upload
              listType="picture-card"
              fileList={fileList}
              customRequest={customRequest}
              onChange={handleUploadChange}
              accept="image/png,image/jpeg,image/webp"
            >
              {fileList.length >= 8 ? null : '+ Upload'}
            </Upload>
          </Form.Item>
          <Form.Item label="Featured" name="isFeatured" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
          <Form.Item label="Active" name="isActive" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
