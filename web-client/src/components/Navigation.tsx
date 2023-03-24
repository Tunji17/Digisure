import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Navigation = () => {
  const { isUserLoggedIn } = useAppContext();

  const navigate = useNavigate();

  const logOut = () => {
    navigate('/');
  }

  return (
    <div className='flex justify-end py-2 border-b border-primary px-20'>
      {isUserLoggedIn && (
        <button className="hover:bg-primary text-black hover:text-white font-semibold py-2 px-4 border border-primary-light rounded shadow" onClick={() => logOut()}>
          Logout
        </button>
      )}
    </div>
  )
}

export default Navigation