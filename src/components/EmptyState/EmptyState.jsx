import React from "react";

/**
 * Reusable empty state component
 * @param {Object} props
 * @param {string} props.icon - SVG path for the icon
 * @param {string} props.title - Title text
 * @param {string} props.message - Description message
 * @param {React.ReactNode} props.action - Optional action button/element
 */
const EmptyState = ({ icon, title = "No items", message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center px-4">
      <svg
        className="w-16 h-16 text-theme-muted mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d={icon}
        />
      </svg>
      <h3 className="text-lg font-medium text-theme-primary mb-1">{title}</h3>
      {message && <p className="text-theme-muted text-sm mb-4">{message}</p>}
      {action}
    </div>
  );
};

// Common icon paths
EmptyState.Icons = {
  FILE: "M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  TRASH:
    "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  SHARE:
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
};

export default EmptyState;
