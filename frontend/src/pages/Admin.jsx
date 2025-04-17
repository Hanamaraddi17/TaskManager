import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Local login check for Admin and Manager
    if (
      (username === 'admin' && password === 'admin') ||
      (username === 'krishna' && password === 'krishna')
    ) {
      setMessage('Login successful!');
      setTimeout(() => {
        const path = username === 'admin' ? '/admin-dashboard' : '/manager-dashboard';
        navigate(path);
      }, 1000);
      return;
    }

    // Optional backend login check
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Login successful!');
        const path = username === 'admin' ? '/admin-dashboard' : '/manager-dashboard';
        setTimeout(() => navigate(path), 1000);
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Server error. Please try again later.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition duration-300 hover:scale-105">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800 hover:text-purple-600 transition duration-300">
            Admin & Manager Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                placeholder="Enter username"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white py-2 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105"
            >
              Log In
            </button>
          </form>

          {message && (
            <p
              className={`mt-5 text-center font-medium transition ${
                message.includes('success') ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Admin;
