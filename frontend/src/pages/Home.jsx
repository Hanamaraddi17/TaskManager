import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Tasks from "../components/Tasks";
import MainLayout from "../layouts/MainLayout";

const Home = () => {
  const authState = useSelector((state) => state.authReducer);
  const { isLoggedIn } = authState;

  useEffect(() => {
    document.title = authState.isLoggedIn
      ? `${authState.user.name}'s Tasks`
      : "Task Manager";
  }, [authState]);

  return (
    <MainLayout>
      {/* Hero Section */}
      {!isLoggedIn ? (
        <div className="h-[60vh] flex flex-col justify-center items-center text-center bg-gradient-to-r from-blue-700 to-blue-500 text-white p-10 rounded-2xl shadow-2xl">
          <h1 className="text-5xl font-extrabold mb-6">Welcome to Task Manager</h1>
          <p className="text-lg max-w-xl opacity-90">
            Organize your work and life in one place. Sign up now to start managing your tasks efficiently!
          </p>
          <Link
            to="/signup"
            className="mt-8 px-8 py-4 bg-white text-blue-700 text-lg font-semibold rounded-full shadow-md hover:bg-blue-200 transition duration-300 flex items-center space-x-2"
          >
            <span>Join Now</span>
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
        
      ) : (
        <div className="p-8">
          <h1 className="text-4xl font-bold text-blue-700 mb-6">
            Welcome, {authState.user.name}!
          </h1>
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <Tasks />
          </div>
        </div>
      )}

      

      {/* Main Content Sections */}
      <div className="mt-16 space-y-16">
        {/* Features Section */}
        <section className="p-10 bg-white rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center">
            Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Task Organization",
                description: "Categorize tasks into different lists to stay organized.",
              },
              {
                title: "Reminders & Deadlines",
                description: "Set due dates and receive notifications before deadlines.",
              },
              {
                title: "Collaboration Tools",
                description: "Share tasks and projects with your team members easily.",
              },
              {
                title: "Cross-Platform Sync",
                description: "Access tasks from your phone, tablet, or computer.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-blue-50 p-5 rounded-lg shadow-md text-center text-gray-700 font-medium hover:bg-blue-100 hover:scale-105 transition-transform duration-300"
              >
                <h3 className="text-lg font-semibold text-blue-800">{feature.title}</h3>
                <p className="text-sm mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="p-10 bg-gray-100 rounded-2xl shadow-xl border border-gray-300">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote: "This app has transformed how I manage my tasks! Highly recommended.",
                name: "Hanamareddy.",
              },
              {
                quote: "A must-have tool for improving productivity and tracking progress.",
                name: "Arvind.",
              },
              {
                quote: "Simple yet powerful! Task Manager keeps my work-life balanced.",
                name: "Vijay.",
              },
            ].map((review, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <p className="italic text-lg">“{review.quote}”</p>
                <span className="font-semibold text-blue-600 block mt-4">
                  - {review.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="p-10 bg-white rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                question: "Is Task Manager free to use?",
                answer: "Yes, we offer a free plan with essential features. A premium plan is available for advanced users.",
              },
              {
                question: "Can I access my tasks on different devices?",
                answer: "Yes, your tasks are synced across multiple devices seamlessly.",
              },
              {
                question: "Is my data secure?",
                answer: "Absolutely! We use advanced encryption and secure cloud storage to protect your information.",
              },
              {
                question: "Can I collaborate with my team?",
                answer: "Yes, you can share tasks, assign responsibilities, and track progress with teammates.",
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="bg-gray-50 p-5 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
              >
                <summary className="font-semibold text-blue-700 cursor-pointer">
                  {faq.question}
                </summary>
                <p className="text-gray-700 mt-2">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Section */}
      <footer className="mt-20 py-6 bg-blue-800 text-center text-white text-sm rounded-xl shadow-lg">
        © {new Date().getFullYear()} <span className="font-bold">Zidio Development</span>. All rights reserved.
      </footer>
    </MainLayout>
  );
};

export default Home;
