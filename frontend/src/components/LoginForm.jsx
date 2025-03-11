import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validateManyFields from '../validations';
import Input from './utils/Input';
import { useDispatch, useSelector } from 'react-redux';
import { postLoginData } from '../redux/actions/authActions';
import Loader from './utils/Loader';

const LoginForm = ({ redirectUrl }) => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector(state => state.authReducer);
  const { loading, isLoggedIn } = authState;

  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectUrl || '/');
    }
  }, [isLoggedIn, redirectUrl, navigate]);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateManyFields('login', formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    dispatch(postLoginData(formData.email, formData.password));
  };

  const fieldError = field => (
    <p className={`mt-1 text-red-500 text-sm ${formErrors[field] ? 'block' : 'hidden'}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500">
      <form className="w-full max-w-md p-8 bg-white shadow-xl rounded-lg transform transition duration-300 hover:scale-105">
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
              Welcome Back! Please Log In
            </h2>

            <div className="mb-5">
              <label htmlFor="email" className="block font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="email"
                id="email"
                value={formData.email}
                placeholder="youremail@domain.com"
                onChange={handleChange}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-500 hover:shadow-lg transition-all"
              />
              {fieldError('email')}
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                placeholder="Your password..."
                onChange={handleChange}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-500 hover:shadow-lg transition-all"
              />
              {fieldError('password')}
            </div>

            <button
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium py-3 rounded-lg hover:from-blue-600 hover:to-indigo-500 hover:shadow-lg transition-all"
              onClick={handleSubmit}
            >
              Log In
            </button>

            <div className="mt-4 text-center">
              <span className="text-gray-600">Don't have an account?</span>{' '}
              <Link to="/signup" className="text-indigo-500 font-medium hover:text-indigo-700 transition-all">
                Sign up here
              </Link>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
