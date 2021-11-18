import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import { useChatContext } from '../../contexts/ChatContext'
import { useUsersContext } from '../../contexts/UsersContext'
import MessagesList from '../../components/MessagesList/MessagesList'
import { Breadcrumb, Spin } from 'antd'
import {
  HomeOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useAuthContext } from '../../contexts/AuthContext'

const DirectMessages = () => {
  const { id } = useParams();
  const { authState: { user } } = useAuthContext();
  const { chatState: { receiver }, chatActions: { selectReceiver } } = useChatContext();
  const { usersState: { isLoading: usersLoading } } = useUsersContext();

  useEffect(() => {
    selectReceiver({ id })
  }, [id])

  if (usersLoading) {
    return <Spin tip="Loading..." className="spinner" />
  }

  return <>
    <Breadcrumb className="bread-crumb">
      <Breadcrumb.Item>
        <Link to={"/"}>
          <HomeOutlined />
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <UserOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        {receiver?.id === user?.id ? 'You': receiver?.full_name}
      </Breadcrumb.Item>
    </Breadcrumb>
    <MessagesList wrapperClassName="direct-messages"/>
  </>
}

export default DirectMessages
