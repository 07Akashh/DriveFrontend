import React from "react";

const LIMIT_OPTIONS = [4, 12, 20, 40];

/**
 * Reusable pagination component
 * @param {Object} props
 * @param {number} props.page - Current page (0-indexed)
 * @param {number} props.limit - Items per page
 * @param {number} props.total - Total items
 * @param {function} props.onPageChange - Page change callback
 * @param {function} props.onLimitChange - Limit change callback
 */
const Pagination = ({ page, limit, total, onPageChange, onLimitChange }) => {
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
    }
  };

  if (total <= 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-theme mt-4">
      <div className="flex items-center gap-2 text-sm text-theme-secondary">
        <span>Showing</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="input-field py-1 px-2 w-16 text-center"
        >
          {LIMIT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span>of {total}</span>
      </div>

      <div className="flex items-center gap-1">
        {/* First */}
        <button
          onClick={() => handlePageChange(0)}
          disabled={page === 0}
          className="p-2 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="First"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Previous */}
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          className="p-2 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Previous"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 px-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i;
            } else if (page < 2) {
              pageNum = i;
            } else if (page > totalPages - 3) {
              pageNum = totalPages - 5 + i;
            } else {
              pageNum = page - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === pageNum
                    ? "bg-theme-primary text-theme-secondary"
                    : "text-theme-secondary hover:bg-theme-tertiary"
                }`}
              >
                {pageNum + 1}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-2 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Next"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Last */}
        <button
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={page >= totalPages - 1}
          className="p-2 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Last"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
