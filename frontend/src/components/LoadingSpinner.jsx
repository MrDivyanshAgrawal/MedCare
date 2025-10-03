import React from 'react';

const LoadingSpinner = ({ size = 'medium', fullPage = false }) => {
  // Size variants for the spinner
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const spinnerClass = `animate-spin rounded-full border-t-2 border-blue-500 border-r-2 border-blue-500 border-opacity-50 border-b-2 border-blue-500 ${sizeClasses[size] || sizeClasses.medium}`;

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className={spinnerClass}></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div className={spinnerClass}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Button variant with loading state
export const LoadingButton = ({ 
  isLoading, 
  children, 
  disabled, 
  className, 
  ...props 
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`relative ${className} ${isLoading ? 'text-opacity-0' : ''}`}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-t-2 border-r-2 border-blue-500 border-opacity-50 border-b-2 rounded-full animate-spin"></div>
        </div>
      )}
      {children}
    </button>
  );
};

export default LoadingSpinner;
