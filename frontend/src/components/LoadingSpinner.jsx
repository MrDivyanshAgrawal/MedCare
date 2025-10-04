import React from 'react';

const LoadingSpinner = ({ size = 'medium', fullPage = false, text = 'Loading...', color = 'primary' }) => {
  // Size variants for the spinner
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  // Color variants
  const colorClasses = {
    primary: 'border-blue-600',
    secondary: 'border-purple-600',
    success: 'border-green-600',
    danger: 'border-red-600',
    warning: 'border-yellow-600',
    info: 'border-cyan-600'
  };

  const spinnerClass = `animate-spin rounded-full border-4 border-gray-200 ${colorClasses[color] || colorClasses.primary} border-t-transparent ${sizeClasses[size] || sizeClasses.medium}`;

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4">
          <div className={spinnerClass}></div>
          {text && (
            <p className="text-gray-600 font-medium animate-pulse">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center p-4 space-y-2">
      <div className={spinnerClass}></div>
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

// Enhanced Button with loading state
export const LoadingButton = ({ 
  isLoading, 
  children, 
  disabled, 
  className = '',
  loadingText = 'Loading...',
  spinnerColor = 'white',
  ...props 
}) => {
  const spinnerColorClasses = {
    white: 'border-white',
    primary: 'border-blue-600',
    dark: 'border-gray-800'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`relative transition-all duration-200 ${className} ${
        (isLoading || disabled) ? 'opacity-75 cursor-not-allowed' : ''
      }`}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg">
          <div className={`w-5 h-5 border-2 border-gray-300 ${spinnerColorClasses[spinnerColor]} border-t-transparent rounded-full animate-spin`}></div>
        </div>
      )}
      <span className={`${isLoading ? 'invisible' : ''}`}>
        {children}
      </span>
    </button>
  );
};

// Loading card skeleton
export const LoadingSkeleton = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      ))}
    </div>
  );
};

// Loading overlay for sections
export const LoadingOverlay = ({ isLoading, children }) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <LoadingSpinner size="large" />
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
