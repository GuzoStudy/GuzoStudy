import React from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Learn
              <br />
              Anywhere,
              <br />
              Anytime
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join live classes or explore on-demand courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
              <button 
              onClick={() => navigate('/explore')}
              className="bg-gray-200 text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors">
                Browse Courses
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-lg p-8 transform rotate-3">
              <div className="bg-gray-100 rounded-xl p-6 mb-4">
                <div className="w-16 h-16 bg-yellow-400 rounded-full mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="w-24 h-24 bg-yellow-200 rounded-full"></div>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg p-4 transform -rotate-6">
              <div className="w-12 h-12 bg-blue-500 rounded-lg mb-2 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="w-16 h-16 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;