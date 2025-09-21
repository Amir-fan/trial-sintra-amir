import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-white/30 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-white/25 rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-1 h-1 bg-white/35 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/15 rounded-full"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-medium text-white/90">AI-Powered Content Generation</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Soshie AI
              </h1>
              <p className="text-xl text-blue-100 font-light leading-relaxed">
                Transform your products into viral social media content with AI-powered precision. 
                Create engaging posts for Twitter, Instagram, and LinkedIn in seconds.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">AI-Powered</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Multi-Platform</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Instant Results</span>
              </div>
            </div>
          </div>
          
          {/* Soshie Character */}
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
                <p className="text-blue-100">Your creative companion is here to help!</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-500/20 rounded-full blur-lg"></div>
    </header>
  );
};
