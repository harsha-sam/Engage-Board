import React, { useState } from 'react'
import { Button, Modal, Form, Input } from 'antd';

const AddTeam = ({ handleSubmit }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleSubmit(form.getFieldsValue())
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Create a new classroom
      </Button>
      <Modal title="Create a new classroom"
        centered
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
          </Button>
        ]}>
        <Form
          name="New Classroom"
          form={form}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Class Name"
            rules={[
              {
                required: true,
                message: 'Please input team name!',
              },
            ]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="description"
            label="Class Description"
            tooltip="Description can only be upto 300 characters"
            rules={[
              {
                required: true,
                message: 'Please input team description!',
              },
            ]}
          >
            <Input.TextArea maxLength={300} autoSize={{ minRows: 3, maxRows: 6 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AddTeam
