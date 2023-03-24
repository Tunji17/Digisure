import React from 'react'
import { useAppContext } from './context/AppContext';
import Navigation from './components/Navigation';
import FundAccount from './components/FundAccount';
import TransferFunds from './components/TransferFunds';
import Transactions from './components/Transactions';

const Dashboard = () => {

  const { user } = useAppContext();
  console.log("user", user);

  return (
    <div>
      <Navigation />
      <div className="flex justify-center p-5">
        <div className='flex flex-col w-full space-y-5 align-center p-5'>
          <div className="flex w-1/2 space-x-4">
            <FundAccount />
            <TransferFunds />
          </div>
          <Transactions />
        </div>
      </div>
    </div>

  )
}

export default Dashboard