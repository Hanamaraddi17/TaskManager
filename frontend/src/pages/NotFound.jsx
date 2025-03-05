import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const NotFound = () => {
  return (
    <MainLayout>
      <div className='w-full py-16 text-center flex flex-col items-center bg-white'>
        <img
          src="/assets/404-error/404.jpg" 
          alt="Page Not Found"
          className="w-300 h-80 object-cover mb-6"
        />
        <h2 className='text-xl mb-4'>The page you are looking for doesn't exist</h2>
        <Link 
          to="/" 
          className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-600 transition"
        >
          Go to Home Page
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;
