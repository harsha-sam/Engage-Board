import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext.jsx';
import { UsersProvider } from './contexts/UsersContext.jsx';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    {/* All routes should be wrapped under Router */}
    <Router>
      {/* AuthProvider provides contains current user info and signin, signup, signout or any user required actions*/}
      <AuthProvider>
        {/* UsersProvider provides list of all users. Wrapping it here so any component can use the list of users*/}
        <UsersProvider>
          <App />
        </UsersProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
  // rendering the app on id root
  document.getElementById('root')
);
