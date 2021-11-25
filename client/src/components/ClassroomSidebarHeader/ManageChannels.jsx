import React, { useState, useEffect } from "react";
import { useClassroomContext } from "../../contexts/ClassroomContext.jsx";
import {
  Modal,
  Tabs,
  Radio,
  Select,
  Input,
  Form,
  Checkbox,
  message,
} from "antd";

const { TabPane } = Tabs;
const { Option } = Select;

const defaultForm = {
  categoryType: "existing",
  updating_channel_category_id: null,
  category_id: null,
  category_name: null,
  channel_name: null,
  channel_id: null,
  message_permission: ["admin", "monitor", "student"],
};

const ManageChannels = ({ showModal, onClose }) => {
  let {
    classroomState: { categories },
    classroomActions: { addChannel, editChannel, removeChannel },
  } = useClassroomContext();

  const [formState, setFormState] = useState(defaultForm);
  const [tabKey, setTabKey] = useState("add");
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    let allChannels = [];
    categories.forEach((category) => {
      allChannels = allChannels.concat(category.channels);
    });
    setChannels(allChannels);
  }, [categories]);

  const handleChange = (event) => {
    let { name, value } = event.target;
    if (name === "updating_channel_category_id") {
      let selectedCategory = categories.filter(
        (category) => category.id === value
      );
      setChannels(selectedCategory[0].channels);
    }
    setFormState({ ...formState, [name]: value });
  };

  const changeTab = (val) => {
    setTabKey(val);
    setFormState(defaultForm);
  };

  const checkFormValidity = (keys) => {
    for (let key of keys) if (!formState[key]) return false;
    return true;
  };

  const handleSubmit = () => {
    const { categoryType } = formState;
    switch (tabKey) {
      case "add": {
        if (categoryType === "existing") {
          if (
            !checkFormValidity([
              "category_id",
              "channel_name",
              "message_permission",
            ])
          )
            return message.error("Fill all the required fields");
          else
            addChannel({
              category_id,
              channel_name,
              message_permission,
            });
        } else {
          if (
            !checkFormValidity([
              "category_name",
              "channel_name",
              "message_permission",
            ])
          )
            return message.error("Fill all the required fields");
          else
            addChannel({
              category_name,
              channel_name,
              message_permission,
            });
        }
        break;
      }
      case "update": {
        if (
          !checkFormValidity([
            "updating_channel_category_id",
            "channel_id",
            "category_id",
            "channel_name",
            "message_permission",
          ])
        )
          return message.error("Fill all the required fields");
        else
          editChannel({
            id: channel_id,
            channel_name,
            category_id,
            message_permission,
          });
        break;
      }
      case "remove": {
        if (!checkFormValidity(["updating_channel_category_id", "channel_id"]))
          return message.error("Fill all the required fields");
        else removeChannel({ id: channel_id });
        break;
      }
      default:
        return;
    }
    setFormState(defaultForm);
    onClose();
  };

  const {
    categoryType,
    category_id,
    updating_channel_category_id,
    category_name,
    channel_id,
    channel_name,
    message_permission,
  } = formState;
  return (
    <Modal
      title={""}
      visible={showModal}
      onCancel={onClose}
      maskClosable={false}
      onOk={handleSubmit}
    >
      <Tabs activeKey={tabKey} centered onChange={changeTab}>
        <TabPane tab="Add Channel" key="add">
          <div>
            <Form.Item label="Category" required>
              <Radio.Group
                name="categoryType"
                value={categoryType}
                onChange={handleChange}
                defaultValue={"existing"}
              >
                <Radio value={"existing"}>Existing Category</Radio>
                <Radio value={"new"}>New Category</Radio>
              </Radio.Group>
            </Form.Item>
            {categoryType === "existing" ? (
              <CustomSelect
                selectName={"category_id"}
                value={category_id}
                selectPlaceholder={"Choose an existing category"}
                selectOptions={categories}
                formItemLabel={"Select an existing category"}
                handleChange={handleChange}
              />
            ) : (
              <Form.Item label="New Category Name" required>
                <Input
                  name="category_name"
                  placeholder="Type New Category Name here"
                  onChange={handleChange}
                  value={category_name}
                  autoComplete="off"
                />
              </Form.Item>
            )}
            <ChannelForm
              handleChange={handleChange}
              channel_name={channel_name}
              messagePermission={message_permission}
            />
          </div>
        </TabPane>
        <TabPane tab="Edit Channel" key="update">
          <CustomSelect
            selectName={"updating_channel_category_id"}
            value={updating_channel_category_id}
            selectOptions={categories}
            formItemLabel={"Select the category of the channel to be updated"}
            handleChange={handleChange}
          />
          <CustomSelect
            selectName={"channel_id"}
            value={channel_id}
            selectOptions={channels}
            disabled={!updating_channel_category_id}
            formItemLabel={"Channel to be updated"}
            handleChange={handleChange}
          />
          {updating_channel_category_id && channel_id && (
            <>
              <CustomSelect
                selectName={"category_id"}
                value={category_id}
                selectOptions={categories}
                formItemLabel={"Select the new category of channel"}
                handleChange={handleChange}
              />
              <ChannelForm
                handleChange={handleChange}
                channel_name={channel_name}
                messagePermission={message_permission}
              />
            </>
          )}
        </TabPane>
        <TabPane tab="Remove Channel" key="remove">
          <CustomSelect
            selectName={"updating_channel_category_id"}
            value={updating_channel_category_id}
            selectOptions={categories}
            formItemLabel={"Select the category of the channel to be deleted"}
            handleChange={handleChange}
          />
          <CustomSelect
            selectName={"channel_id"}
            value={channel_id}
            selectOptions={channels}
            disabled={!updating_channel_category_id}
            formItemLabel={"Channel to be deleted"}
            handleChange={handleChange}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

const ChannelForm = ({ handleChange, channelName, messagePermission }) => {
  return (
    <>
      <Form.Item label={"Channel Name"} required>
        <Input
          placeholder="Type Channel Name here"
          name={"channel_name"}
          value={channelName}
          onChange={handleChange}
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item label="Messaging Permissions" required>
        <Checkbox.Group
          name={"message_permission"}
          onChange={(val) =>
            handleChange({ target: { name: "message_permission", value: val } })
          }
          value={messagePermission}
        >
          <Checkbox value={"admin"}>Admin</Checkbox>
          <Checkbox value={"monitor"}>Monitors</Checkbox>
          <Checkbox value={"student"}>Students</Checkbox>
        </Checkbox.Group>
      </Form.Item>
    </>
  );
};

const CustomSelect = ({
  formItemLabel,
  selectName,
  selectOptions,
  handleChange,
  value,
  ...props
}) => {
  return (
    <Form.Item label={formItemLabel} required>
      <Select
        name={selectName}
        value={value}
        optionFilterProp={"label"}
        placeholder="Select.."
        showSearch
        autoComplete="off"
        onChange={(val) =>
          handleChange({ target: { name: selectName, value: val } })
        }
        {...props}
      >
        {selectOptions.map((option) => {
          return (
            <Option value={option.id} key={option.id} label={option.name}>
              {option.name}
            </Option>
          );
        })}
      </Select>
    </Form.Item>
  );
};

export default ManageChannels;
