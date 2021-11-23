import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// context imports
import { useAuthContext } from "./contexts/AuthContext.jsx";
import { ClassroomsProvider } from "./contexts/ClassroomsContext.jsx";
import { ClassroomProvider } from "./contexts/ClassroomContext.jsx";
import { NotesProvider } from "./contexts/NotesContext.jsx";
import { ChatProvider } from "./contexts/ChatContext.jsx";
// pages imports
import {
  Login,
  Register,
  EditUserProfile,
  DirectMessages,
  Classrooms,
  Classroom,
  Notes,
  Note,
  ErrorPage,
} from "./pages/";
// custom components imports
import Navigation from "./components/Navigation/Navigation.jsx";
// antd imports
import { Spin } from "antd";
// css
import "antd/dist/antd.css";
import "./App.css";

const App = () => {
  const {
    authState: { user, isLoading, dyslexiaFontToggled },
  } = useAuthContext();

  if (isLoading) {
    // the app will be loading till the user info is fetched from server with existing access token.
    return <Spin tip="Loading..." className="spinner" />;
  } else if (!user) {
    // When their is no current user state. Only login and registration routes are available.
    return (
      <Routes>
        <Route exact path="*" element={<Navigate to="/login" />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
      </Routes>
    );
  } else {
    // When the user is authenticated. All routes of the app is accessible.
    return (
      // if dyslexia font is enabled, then the classname dyslexia-font will be added
      <main className={dyslexiaFontToggled ? "dyslexia-font" : undefined}>
        <Routes>
          {/* default route should be '/classrooms' */}
          <Route exact path="/login" element={<Navigate to="/classrooms" />} />
          <Route
            exact
            path="/register"
            element={<Navigate to="/classrooms" />}
          />
          <Route exact path="/" element={<Navigation />}>
            {/* Subroutes (Pages nested inside the navigation menu)*/}
            <Route exact path="/" element={<Navigate to="/classrooms" />} />
            {/* Classrooms */}
            <Route
              exact
              path="/classrooms"
              element={
                <ClassroomsProvider>
                  <Classrooms />
                </ClassroomsProvider>
              }
            />
            {/* User Profile */}
            <Route exact path="/profile" element={<EditUserProfile />} />
            {/* Direct Messages */}
            <Route
              exact
              path="/direct-messages/:id/"
              element={
                <ClassroomProvider>
                  <ChatProvider>
                    <DirectMessages />
                  </ChatProvider>
                </ClassroomProvider>
              }
            />
            {/* All notes of the user */}
            <Route
              exact
              path="/notes/"
              element={
                <NotesProvider>
                  <Notes />
                </NotesProvider>
              }
            />
            {/* Specific Note */}
            <Route
              exact
              path="/notes/:id"
              element={
                <NotesProvider>
                  <Note />
                </NotesProvider>
              }
            />
          </Route>
          {/* Specific Classroom */}
          <Route
            exact
            path="/classrooms/:id"
            element={
              <ClassroomsProvider>
                <ClassroomProvider>
                  <ChatProvider>
                    <Classroom />
                  </ChatProvider>
                </ClassroomProvider>
              </ClassroomsProvider>
            }
          />
          {/* Error Pages */}
          <Route
            path="/error403"
            element={
              <ErrorPage
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
              />
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
    );
  }
};

export default App;
