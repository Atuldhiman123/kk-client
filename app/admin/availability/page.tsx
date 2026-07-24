'use client';

import { useEffect, useState } from 'react';
import { App, Button, Form, Modal, Popconfirm, Select, Switch, Table, TimePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
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
    { title: 'Day', dataIndex: 'dayOfWeek', render: (v: number) => DAY_NAMES[v] },
    { title: 'Start Time', dataIndex: 'startTime' },
    { title: 'End Time', dataIndex: 'endTime' },
    { title: 'Active', dataIndex: 'isActive', render: (v: boolean) => (v ? 'Yes' : 'No') },
    {
      title: '',
      render: (_, record) => (
        <div className="flex gap-3">
          <button className="font-medium" style={{ color: '#B8860B' }} onClick={() => openEdit(record)}>
            Edit
          </button>
          <Popconfirm title="Remove this availability entry?" onConfirm={() => handleDelete(record.id)}>
            <button className="font-medium text-red-600">Delete</button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">Weekly Availability</h1>
        <Button type="primary" onClick={openCreate}>
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
