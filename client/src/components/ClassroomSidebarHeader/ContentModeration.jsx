import React, { useState, useEffect } from "react";
import { useClassroomContext } from "../../contexts/ClassroomContext.jsx";
import { Modal, Switch } from "antd";

const ContentModeration = ({ showModal, onClose }) => {
  let {
    classroomState: { is_moderation_enabled },
    classroomActions: { saveContentModerationSettings },
  } = useClassroomContext();
  let [toggleModeration, setToggleModeration] = useState(is_moderation_enabled);

  useEffect(() => {
    setToggleModeration(is_moderation_enabled);
  }, [is_moderation_enabled]);

  const handleSave = () => {
    saveContentModerationSettings({
      is_moderation_enabled: toggleModeration,
    });
    onClose();
  };

  return (
    <Modal
      title="Content Moderation Settings"
      visible={showModal}
      onOk={handleSave}
      onCancel={onClose}
      okText={"Save"}
      maskClosable={false}
    >
      <h3 level={4}>
        Uses Azure Cognitive Services to detect profanity and auto deletes the
        messages identified.
      </h3>
      <br />
      <label>Toggle Content Moderation in this classroom</label>
      <Switch onChange={setToggleModeration} checked={toggleModeration} />
    </Modal>
  );
};

export default ContentModeration;
