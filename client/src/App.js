import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from './contexts/AuthContext';
import { ClassroomsProvider } from './contexts/ClassroomsContext';
import { ClassroomProvider } from './contexts/ClassroomContext';
import { NotesProvider } from './contexts/NotesContext';
import { ChatProvider } from './contexts/ChatContext';
import {
  Login,
  Register,
  EditUserProfile,
  DirectMessages,
  Classrooms,
  Classroom,
  Notes
} from './pages/'
import Navigation from './components/Navigation/Navigation';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Note from './components/Note/Note';
import { Spin } from 'antd';
import 'antd/dist/antd.css';
import './App.css';

const App = () => {
  const { authState: { user, isLoading } } = useAuthContext();


  if (isLoading) {
    return <Spin tip="Loading..." className="spinner" />
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
        <Route exact path="/" element={<Navigation />}>
          <Route exact path="/" element={
            <ClassroomsProvider>
              <Classrooms />
            </ClassroomsProvider>
          } />
          <Route exact path="/classrooms" element={
            <ClassroomsProvider>
              <Classrooms />
            </ClassroomsProvider>
          } />
          <Route exact path="/profile" element={
            <EditUserProfile />
          } />
          <Route exact path="/direct-messages/:id/" element={
            <ChatProvider>
              <DirectMessages />
            </ChatProvider>
          } />
          <Route exact path="/notes/" element={
            <NotesProvider>
              <Notes />
            </NotesProvider>
          } />
          <Route exact path="/notes/:id" element={
            <NotesProvider>
              <Note />
            </NotesProvider>
          } />
        </Route>
        <Route exact path="/classrooms/:id" element={
          <ClassroomsProvider>
            <ClassroomProvider>
              <ChatProvider>
                <Classroom />
              </ChatProvider>
            </ClassroomProvider>
          </ClassroomsProvider>
        } />
        <Route path="/error403" element={
          <ErrorPage
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
          />} />
        <Route path="*" element={
          <ErrorPage />} />
      </Routes>
    </>
    )
  }
}

export default App
