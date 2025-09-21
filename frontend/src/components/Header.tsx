import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Soshie AI
                <span className="block text-3xl lg:text-4xl font-light mt-2">
                  Social Media Generator
                </span>
              </h1>
              <p className="text-xl text-purple-100 leading-relaxed">
                Transform your products into viral social media content with AI-powered precision. 
                Create engaging posts for Twitter, Instagram, and LinkedIn in seconds.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Multi-Platform</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Instant Results</span>
              </div>
            </div>
          </div>
          
          {/* Astronaut Images */}
          <div className="relative">
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="text-center space-y-4">
                <div className="relative w-48 h-48 mx-auto">
                  <img 
                    src="/images/astronaut-1.png" 
                    alt="Soshie AI Assistant" 
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-lg animate-pulse">
                    ✨
                  </div>
                </div>
                <h3 className="text-2xl font-bold">AI Assistant Ready</h3>
                <p className="text-purple-100">Your creative companion is here to help!</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </header>
  );
};
