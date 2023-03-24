import React from 'react'
import { useAppContext } from './context/AppContext';
import Navigation from './components/Navigation';
import FundAccount from './components/FundAccount';

const Dashboard = () => {

  const { user, accessToken } = useAppContext();
  console.log("user", user);
  console.log('accessToken', accessToken);


  return (
    <div>
      <Navigation />
      <div className="flex justify-center p-5">
        <div className="w-1/2">
          <FundAccount />
        </div>
      </div>
    </div>

  )
}

export default Dashboard