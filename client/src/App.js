import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from './contexts/AuthContext';
import { Spin } from 'antd';
import {
  Login,
  Register,
  EditUserProfile,
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
    return <Spin tip="Loading..." style={{ position: 'absolute', left: '50%', top: '40%' }} />
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
        <Route exact path="/user_profile" element={
          <Navigation>
            <EditUserProfile />
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
