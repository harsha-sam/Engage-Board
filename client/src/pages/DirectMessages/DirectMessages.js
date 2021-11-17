import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import MessagesList from '../../components/MessagesList/MessagesList'
import { Breadcrumb, Spin } from 'antd'
import { useChatContext } from '../../contexts/ChatContext'
import {
  HomeOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useUsersContext } from '../../contexts/UsersContext'
import ErrorPage from '../../components/ErrorPage/ErrorPage'

const DirectMessages = () => {
  const { id } = useParams();
  const [chattingWith, setChattingWith] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { chatActions: { selectReceiver } } = useChatContext();
  const { usersState: {users, isLoading: usersLoading } } = useUsersContext();

  useEffect(() => {
    selectReceiver({ id })
    return (() => setChattingWith(null))
  }, [id])

  useEffect(() => {
    setIsLoading(true)
    for (let user of users) {
      if (user.id === id) {
        setChattingWith(user)
        break
      }
    }
    setIsLoading(false)
  }, [users, id])

  if (isLoading || usersLoading) {
    return <Spin tip="Loading..." className="spinner" />
  }

  if (!chattingWith) {
    return <ErrorPage title={"User not found"}
      subTitle={"Sorry, the user does not exist. If the user recently registered. Please refresh"}
    />
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
      <Breadcrumb.Item>{chattingWith.full_name}</Breadcrumb.Item>
    </Breadcrumb>
    <MessagesList wrapperClassName="direct-messages"/>
  </>
}

export default DirectMessages
