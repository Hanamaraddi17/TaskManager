import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center space-x-3 my-8">
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce animation-delay-0"></div>
      <div className="w-6 h-6 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
      <div className="w-8 h-8 bg-blue-500 rounded-full animate-bounce animation-delay-400"></div>
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce animation-delay-100"></div>
    </div>
  );
};

export default Loader;
