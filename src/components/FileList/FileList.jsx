import React, { useState } from "react";
import ShareDialog from "../ShareDialog/ShareDialog";
import { useCustomMutation } from "../../TanstackQuery/QueryHooks";
import api from "../../services/api";
import API_ENDPOINTS from "../../constant/apiEndpoints";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate, formatSize } from "../../utils/AsyncUtils";

const FileList = ({
  files,
  onFileDeleted,
  isSharedView = false,
  isTrashView = false,
  onFileClick,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const { accessToken: token } = useAuth();
  const { mutation: deleteMutation } = useCustomMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
  const { mutation: restoreMutation } = useCustomMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
  const queryClient = useQueryClient();

  const getStreamUrl = (file) => {
    const baseUrl = `${api.defaults.baseURL}${file.streamUrl}`;
    return token ? `${baseUrl}?token=${encodeURIComponent(token)}` : baseUrl;
  };

  const handleDelete = async (file) => {
    if (!window.confirm(`Delete "${file.originalName}"?`)) return;
    try {
      await deleteMutation.mutateAsync({
        url: API_ENDPOINTS.MEDIA.DELETE(file._id),
        method: "DELETE",
        wantToast: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRestore = async (file) => {
    try {
      await restoreMutation.mutateAsync({
        url: API_ENDPOINTS.MEDIA.RESTORE(file._id),
        method: "PUT",
        wantToast: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePermanentDelete = async (file) => {
    if (
      !window.confirm(
        `Permanently delete "${file.originalName}"? This cannot be undone.`
      )
    )
      return;
    try {
      await deleteMutation.mutateAsync({
        url: API_ENDPOINTS.MEDIA.PERMANENT_DELETE(file._id),
        method: "DELETE",
        wantToast: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleShare = (file) => {
    setSelectedFile(file);
    setShowShareDialog(true);
  };

  const getFileIcon = (mimeType) => {
    const cls = "w-6 h-6";
    if (mimeType?.startsWith("image/"))
      return (
        <svg
          className={`${cls} text-blue-400`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
    if (mimeType?.startsWith("video/"))
      return (
        <svg
          className={`${cls} text-purple-400`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      );
    if (mimeType?.includes("pdf"))
      return (
        <svg
          className={`${cls} text-red-400`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      );
    return (
      <svg
        className={`${cls} text-theme-muted`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
        {files.map((file) => (
          <div
            key={file._id}
            className="card hover:border-theme-tertiary transition-colors group"
          >
            <div
              className="h-28 flex items-center justify-center bg-theme-tertiary rounded-t-xl cursor-pointer"
              onClick={() => onFileClick?.(file)}
            >
              {file.mimeType?.startsWith("image/") && file.streamUrl ? (
                <img
                  src={getStreamUrl(file)}
                  alt={file.originalName}
                  className="h-full w-full object-cover rounded-t-xl"
                />
              ) : (
                getFileIcon(file.mimeType)
              )}
            </div>
            <div className="p-3">
              <h3
                className="text-theme-primary text-sm font-medium truncate"
                title={file.originalName}
              >
                {file.originalName}
              </h3>
              <p className="text-theme-muted text-xs mt-0.5">
                {formatSize(file.size)} •{" "}
                {formatDate(file.uploadedAt || file.createdAt)}
              </p>
              <div className="flex items-center gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                {isTrashView ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(file);
                      }}
                      className="flex-1 p-1.5 bg-theme-tertiary hover:bg-green-900/50 rounded text-theme-secondary hover:text-green-400 transition-colors"
                      title="Restore"
                    >
                      <svg
                        className="w-4 h-4 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePermanentDelete(file);
                      }}
                      className="p-1.5 bg-theme-tertiary hover:bg-red-900/50 rounded text-theme-secondary hover:text-red-400 transition-colors"
                      title="Delete Forever"
                    >
                      <svg
                        className="w-4 h-4 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </>
                ) : (
                  !isSharedView && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(file);
                        }}
                        className="flex-1 p-1.5 bg-theme-tertiary hover:bg-theme-secondary rounded text-theme-secondary hover:text-theme-primary transition-colors"
                        title="Share"
                      >
                        <svg
                          className="w-4 h-4 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(file)}
                        className="p-1.5 bg-theme-tertiary hover:bg-red-900/50 rounded text-theme-secondary hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <svg
                          className="w-4 h-4 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {showShareDialog && selectedFile && (
        <ShareDialog
          file={selectedFile}
          onClose={() => {
            setShowShareDialog(false);
            setSelectedFile(null);
          }}
        />
      )}
    </>
  );
};

export default FileList;
