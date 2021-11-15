import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from './contexts/AuthContext';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import {
  Login,
  Register,
  AvatarUploader,
  Classrooms,
  Classroom
} from './pages/'
import Navigation from './components/Navigation/Navigation';
import { ClassroomsProvider } from './contexts/ClassroomsContext';
import { ClassroomProvider } from './contexts/ClassroomContext';
import { ChatProvider } from './contexts/ChatContext';
import 'antd/dist/antd.css';
import './App.css';

const App = () => {
  const { authState: { user, isLoading } } = useAuthContext();


  if (isLoading) {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
    return <Spin indicator={antIcon} />
  }
  else if (!user) {
    return <Routes>
      <Route exact path="*" element={<Navigate to="/login" />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/register" element={<Register />} />
    </Routes>
  }
  else {
    return (<>
      <Routes>
        <Route exact path="/login" element={<Navigate to="/classrooms" />} />
        <Route exact path="/register" element={<Navigate to="/classrooms" />} />
        <Route exact path="/" element={<Navigate to="/classrooms" />} />
        <Route exact path="/classrooms" element={
          <Navigation>
            <ClassroomsProvider>
              <Classrooms />
            </ClassroomsProvider>
          </Navigation>
        } />
        <Route exact path="/avatar" element={
          <Navigation>
            <AvatarUploader />
          </Navigation>
        } />
        <Route exact path="/classrooms/:id" element={
          <ClassroomProvider>
            <ChatProvider>
              <Classroom />
            </ChatProvider>
          </ClassroomProvider>
        } />
      </Routes>
    </>
    )
  }
}

export default App
