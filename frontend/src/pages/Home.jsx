import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Tasks from '../components/Tasks';
import MainLayout from '../layouts/MainLayout';

const Home = () => {
  const authState = useSelector((state) => state.authReducer);
  const { isLoggedIn } = authState;

  useEffect(() => {
    document.title = authState.isLoggedIn
      ? `${authState.user.name}'s Tasks`
      : 'Task Manager';
  }, [authState]);

  return (
    <MainLayout>
      {!isLoggedIn ? (
        <div className="h-[60vh] flex flex-col justify-center items-center text-center bg-gradient-to-r from-blue-600 to-blue-400 text-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Welcome to Task Manager</h1>
          <p className="text-lg max-w-lg">
            Organize your work and life, all in one place. Sign up now to start managing your tasks efficiently!
          </p>
          <Link
            to="/signup"
            className="mt-6 px-6 py-3 bg-white text-blue-600 text-lg font-medium rounded-full shadow-md hover:bg-blue-100 transition duration-300 flex items-center space-x-2"
          >
            <span>Join Now</span>
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      ) : (
        <div className="p-8">
          <h1 className="text-3xl font-semibold text-blue-700 mb-4">
            Welcome, {authState.user.name}!
          </h1>
          <div className="bg-white shadow-md rounded-lg p-6">
            <Tasks />
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Home;
