import React from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import { AppContextProvider } from './context/AppContext';

import './App.css';

function AppRoutes() {
  const routes = useRoutes(
    [
      {path:'/',element:<Login/>},
      {path:'/signup',element:<Signup/>},
      {path:'/dashboard',element:<Dashboard/>}
    ]
  )
  return routes;
}


function App() {
  return (
    <AppContextProvider>
      <Router>
        <AppRoutes/>
      </Router>
      <Toaster />
    </AppContextProvider>
  );
}

export default App;
