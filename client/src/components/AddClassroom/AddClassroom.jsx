import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";

// Add New Classroom Button and Modal
const AddClassroom = ({ handleSubmit, loading }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleSubmit(form.getFieldsValue());
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal} loading={loading}>
        Create a new classroom
      </Button>
      <Modal
        title="Create a new classroom"
        centered
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
          </Button>,
        ]}
      >
        <Form name="New Classroom" form={form} autoComplete="off">
          <Form.Item
            name="name"
            label="Class Name"
            tooltip="Class Name can only be upto 30 characters"
            rules={[
              {
                required: true,
                message: "Please input class name!",
              },
            ]}
          >
            <Input maxLength={30} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Class Description / Info"
            tooltip="Description can only be upto 300 characters"
            rules={[
              {
                required: true,
                message: "Please input class description!",
              },
            ]}
          >
            <Input.TextArea
              maxLength={300}
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddClassroom;
