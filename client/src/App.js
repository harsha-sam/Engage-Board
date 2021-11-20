import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from './contexts/AuthContext.jsx';
import { ClassroomsProvider } from './contexts/ClassroomsContext.jsx';
import { ClassroomProvider } from './contexts/ClassroomContext.jsx';
import { NotesProvider } from './contexts/NotesContext.jsx';
import { ChatProvider } from './contexts/ChatContext.jsx';
import {
  Login,
  Register,
  EditUserProfile,
  DirectMessages,
  Classrooms,
  Classroom,
  Notes,
  Note,
  ErrorPage
} from './pages/'
import Navigation from './components/Navigation/Navigation.jsx';
import { Spin } from 'antd';
import 'antd/dist/antd.css';
import './App.css';

const App = () => {
  const { authState: { user, isLoading, dyslexiaFontToggled } } = useAuthContext();


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
    return (<main className={dyslexiaFontToggled && 'dyslexia-font'}>
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
    </main>
    )
  }
}

export default App
