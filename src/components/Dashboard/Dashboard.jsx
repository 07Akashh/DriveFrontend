import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useCustomQuery } from "../../TanstackQuery/QueryHooks";
import API_ENDPOINTS from "../../constant/apiEndpoints";
import FileList from "../FileList/FileList";
import FilePreviewModal from "../FilePreview/FilePreviewModal";

const LIMIT_OPTIONS = [4, 12, 20, 40];

const Dashboard = () => {
  const { view, searchQuery, setShowUpload } = useOutletContext();
  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    React.useState(searchQuery);
  const [previewFile, setPreviewFile] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(12);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(0); // Reset to first page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page when view changes
  React.useEffect(() => {
    setPage(0);
  }, [view]);

  const { data: filesData, isLoading } = useCustomQuery({
    queryProps: {
      queryKey: ["files", view, debouncedSearchQuery, page, limit],
      staleTime: 60 * 1000,
    },
    payload: {
      url:
        view === "files"
          ? API_ENDPOINTS.MEDIA.LIST
          : view === "trash"
          ? API_ENDPOINTS.MEDIA.TRASH_LIST
          : API_ENDPOINTS.MEDIA.SHARED_WITH_ME,
      params: { filename: debouncedSearchQuery, page, limit },
    },
  });

  const displayFiles = filesData?.media || [];
  const total = filesData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(0);
  };

  const getEmptyStateMessage = () => {
    switch (view) {
      case "trash":
        return "No files in trash";
      case "shared":
        return "Files shared with you will appear here";
      default:
        return "Upload your first file";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 overflow-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="spinner w-8 h-8" />
            <p className="mt-4 text-theme-muted text-sm">Loading files...</p>
          </div>
        ) : displayFiles.length === 0 ? (
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
                d={
                  view === "trash"
                    ? "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    : "M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                }
              />
            </svg>
            <h3 className="text-lg font-medium text-theme-primary mb-1">
              No files
            </h3>
            <p className="text-theme-muted text-sm mb-4">
              {getEmptyStateMessage()}
            </p>
            {view === "files" && (
              <button
                onClick={() => setShowUpload(true)}
                className="btn-primary"
              >
                Upload
              </button>
            )}
          </div>
        ) : (
          <FileList
            files={displayFiles}
            view={view}
            onFileDeleted={() => {}}
            isSharedView={view === "shared"}
            isTrashView={view === "trash"}
            onFileClick={setPreviewFile}
          />
        )}
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-theme mt-4">
          <div className="flex items-center gap-2 text-sm text-theme-secondary">
            <span>Showing</span>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
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
      )}

      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
