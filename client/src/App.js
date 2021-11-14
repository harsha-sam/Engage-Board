import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from './contexts/AuthContext';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import {
  Login,
  Register,
  AvatarUploader,
  Classrooms
} from './pages/'
import Navigation from './components/Navigation/Navigation';
import { ClassroomsProvider } from './contexts/ClassroomsContext';
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
      <Navigation>
        <Routes>
          <Route exact path="/login" element={<Navigate to="/classrooms" />} />
          <Route exact path="/register" element={<Navigate to="/classrooms" />} />
          <Route exact path="/classrooms" element={
            <ClassroomsProvider>
              <Classrooms />
            </ClassroomsProvider>
          } />
          <Route exact path="/avatar" element={<AvatarUploader />}>
          </Route>
        </Routes>
      </Navigation>
    </>
    )
  }
}

export default App
