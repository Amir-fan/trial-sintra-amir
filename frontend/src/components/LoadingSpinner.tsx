import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <img 
          src="/images/astronaut-2.png" 
          alt="Loading..." 
          className="w-full h-full object-contain"
        />
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
};
