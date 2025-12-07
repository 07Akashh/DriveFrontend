import React from "react";

/**
 * Reusable loading spinner component
 * @param {Object} props
 * @param {string} props.message - Optional loading message
 * @param {string} props.size - Size: 'sm', 'md', 'lg'
 */
const Loading = ({ message = "Loading...", size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className={`spinner ${sizeClasses[size]}`} />
      {message && <p className="mt-4 text-theme-muted text-sm">{message}</p>}
    </div>
  );
};

export default Loading;
