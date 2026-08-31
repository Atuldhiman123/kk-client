import { DatePicker, Form, Input, Select, TimePicker } from 'antd';
import dayjs from 'dayjs';

export function BirthDetailsStep() {
  return (
    <div className="space-y-1">
      <Form.Item
        label="Profile Name"
        name="profileName"
        tooltip="The person this consultation is for (e.g. self, spouse, child)"
        rules={[{ required: true, message: 'Please enter a profile name' }]}
      >
        <Input placeholder="e.g. Self, Rahul, Priya" size="middle" className="!rounded-xl" />
      </Form.Item>

      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-3">
        <Form.Item
          label="Date of Birth"
          name="dob"
          rules={[{ required: true, message: 'Please select date of birth' }]}
        >
          <DatePicker
            className="w-full !rounded-xl"
            size="middle"
            format="DD-MM-YYYY"
            disabledDate={(date) => date.isAfter(dayjs().endOf('day'))}
          />
        </Form.Item>

        <Form.Item label="Time of Birth" name="birthTime">
          <TimePicker className="w-full !rounded-xl" size="middle" format="hh:mm A" use12Hours />
        </Form.Item>
      </div>

      <Form.Item
        label="Birth Place"
        name="birthPlace"
        rules={[{ required: true, message: 'Please enter birth place' }]}
      >
        <Input placeholder="City, State, Country" size="middle" className="!rounded-xl" />
      </Form.Item>

      <Form.Item label="Gender" name="gender">
        <Select
          size="middle"
          className="w-full !rounded-xl"
          placeholder="Select gender"
          allowClear
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
          ]}
        />
      </Form.Item>
    </div>
  );
}
