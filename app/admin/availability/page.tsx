'use client';

import { useEffect, useState } from 'react';
import { App, Button, Form, Modal, Popconfirm, Select, Switch, Table, Tag, TimePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import { EditOutlined, PoweroffOutlined, PlusOutlined } from '@ant-design/icons';
import {
  createAdminAvailability,
  deleteAdminAvailability,
  getAdminAvailability,
  updateAdminAvailability,
} from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import type { WeeklyAvailability } from '@/lib/types';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface FormValues {
  dayOfWeek: number;
  range: [Dayjs, Dayjs];
  isActive: boolean;
}

export default function AdminAvailabilityPage() {
  const [entries, setEntries] = useState<WeeklyAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<WeeklyAvailability | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm<FormValues>();
  const { message } = App.useApp();

  const load = () => {
    setLoading(true);
    getAdminAvailability()
      .then(setEntries)
      .catch((err) => message.error(err instanceof ApiError ? err.message : 'Failed to load availability'))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- fetch-on-mount pattern
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (entry: WeeklyAvailability) => {
    setEditing(entry);
    form.setFieldsValue({
      dayOfWeek: entry.dayOfWeek,
      range: [dayjs(entry.startTime, 'HH:mm'), dayjs(entry.endTime, 'HH:mm')],
      isActive: entry.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      dayOfWeek: values.dayOfWeek,
      startTime: values.range[0].format('HH:mm'),
      endTime: values.range[1].format('HH:mm'),
      isActive: values.isActive,
    };
    setSaving(true);
    try {
      if (editing) {
        await updateAdminAvailability(editing.id, payload);
        message.success('Availability updated');
      } else {
        await createAdminAvailability(payload);
        message.success('Availability created');
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
      await deleteAdminAvailability(id);
      message.success('Availability entry removed');
      load();
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : 'Delete failed');
    }
  };

  const columns: ColumnsType<WeeklyAvailability> = [
    {
      title: 'Day',
      dataIndex: 'dayOfWeek',
      render: (v: number) => <span className="font-semibold text-neutral-800">{DAY_NAMES[v]}</span>,
    },
    { title: 'Start Time', dataIndex: 'startTime', className: 'font-mono text-xs text-neutral-700' },
    { title: 'End Time', dataIndex: 'endTime', className: 'font-mono text-xs text-neutral-700' },
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
          <Popconfirm title="Remove this availability entry?" onConfirm={() => handleDelete(record.id)}>
            <button className="font-bold text-xs text-red-600 inline-flex items-center gap-1 hover:text-red-700 transition">
              <PoweroffOutlined className="text-xs" /> Remove
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Weekly Availability</h1>
          <p className="text-xs text-neutral-500 font-medium">Configure day-wise slots and active consultation hours.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} className="h-10 rounded-xl font-bold">
          Add Availability
        </Button>
      </div>

      <Table
        className="mt-6"
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={entries}
        pagination={false}
      />

      <Modal
        title={editing ? 'Edit Availability' : 'Add Availability'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={saving}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item label="Day of Week" name="dayOfWeek" rules={[{ required: true }]}>
            <Select options={DAY_NAMES.map((day, index) => ({ value: index, label: day }))} />
          </Form.Item>
          <Form.Item label="Time Range" name="range" rules={[{ required: true }]}>
            <TimePicker.RangePicker format="hh:mm A" use12Hours className="w-full" />
          </Form.Item>
          <Form.Item label="Active" name="isActive" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
