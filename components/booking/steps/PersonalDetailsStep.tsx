import { Form, Input } from 'antd';

export function PersonalDetailsStep() {
  return (
    <div className="space-y-2">
      <Form.Item
        label="Full Name"
        name="name"
        rules={[{ required: true, message: 'Please enter your full name' }]}
      >
        <Input placeholder="Your full name" size="large" />
      </Form.Item>

      <Form.Item
        label="Mobile Number"
        name="phone"
        rules={[
          { required: true, message: 'Please enter your mobile number' },
          { pattern: /^[+]?[0-9\s-]{7,15}$/, message: 'Enter a valid mobile number' },
        ]}
      >
        <Input placeholder="e.g. 9876543210" size="large" />
      </Form.Item>

      <Form.Item
        label="Email (Optional)"
        name="email"
        rules={[{ type: 'email', message: 'Enter a valid email address' }]}
      >
        <Input placeholder="you@example.com" size="large" />
      </Form.Item>
    </div>
  );
}
