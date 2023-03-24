import React from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';

import './App.css';

function AppRoutes() {
  const routes = useRoutes(
    [
      {path:'/',element:<Login/>},
      {path:'/signup',element:<Signup/>}
    ]
  )
  return routes;
}


function App() {
  return (
    <Router>
      <AppRoutes/>
    </Router>
  );
}

export default App;
