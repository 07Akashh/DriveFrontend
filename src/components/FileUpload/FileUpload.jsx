import React, { useState, useRef, useEffect, useCallback } from "react";
import socketService from "../../services/socketService";
import { useAuth } from "../../context/AuthContext";

const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/") || file.size < 500 * 1024) {
      resolve(file);
      return;
    }
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob && blob.size < file.size) {
            resolve(new File([blob], file.name, { type: file.type }));
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
};

const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

const FileUpload = ({ onClose, onUploadComplete }) => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [uploadState, setUploadState] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (user?._id) socketService.connect(user._id);
    return () => socketService.removeAllListeners();
  }, [user]);

  const handleFiles = useCallback(async (newFiles) => {
    const fileArray = Array.from(newFiles);
    const processed = await Promise.all(fileArray.map((f) => compressImage(f)));
    setFiles((prev) => [...prev, ...processed]);
  }, []);

  const removeFile = useCallback(
    (index) => {
      setFiles((prev) => prev.filter((_, i) => i !== index));
      setUploadState((prev) => {
        const newState = { ...prev };
        delete newState[files[index]?.name];
        return newState;
      });
    },
    [files]
  );

  const uploadFile = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      socketService
        .uploadFile(file, (uploaded, total, percent) => {
          setUploadState((prev) => ({
            ...prev,
            [file.name]: { uploaded, total, percent, status: "uploading" },
          }));
        })
        .then((result) => {
          setUploadState((prev) => ({
            ...prev,
            [file.name]: {
              uploaded: file.size,
              total: file.size,
              percent: 100,
              status: "complete",
            },
          }));
          resolve(result);
        })
        .catch((error) => {
          setUploadState((prev) => ({
            ...prev,
            [file.name]: {
              ...prev[file.name],
              status: "error",
              error: error.message,
            },
          }));
          reject(error);
        });
    });
  }, []);

  const startUpload = useCallback(async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    cancelledRef.current = false;
    const initialState = {};
    files.forEach((f) => {
      initialState[f.name] = {
        uploaded: 0,
        total: f.size,
        percent: 0,
        status: "pending",
      };
    });
    setUploadState(initialState);
    for (const file of files) {
      if (cancelledRef.current) break;
      try {
        await uploadFile(file);
      } catch (error) {
        console.error(`Upload failed: ${file.name}`, error);
      }
    }
    setIsUploading(false);
    if (!cancelledRef.current) onUploadComplete?.();
  }, [files, uploadFile, onUploadComplete]);

  const handleClose = useCallback(() => {
    if (isUploading) {
      if (window.confirm("Cancel upload?")) {
        cancelledRef.current = true;
        setIsUploading(false);
        onClose();
      }
    } else {
      onClose();
    }
  }, [isUploading, onClose]);

  const overallProgress =
    files.length > 0
      ? Math.round(
          Object.values(uploadState).reduce(
            (sum, s) => sum + (s.percent || 0),
            0
          ) / files.length
        )
      : 0;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="card max-w-lg w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-theme">
          <div>
            <h2 className="text-theme-primary font-medium">Upload Files</h2>
            {isUploading && (
              <p className="text-theme-muted text-xs mt-0.5">
                {overallProgress}% complete
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-theme-muted hover:text-theme-primary p-1"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5">
          {/* Hidden file input - must be outside conditional to always be available */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = ""; // Reset to allow re-selecting same file
            }}
            className="hidden"
          />

          {files.length === 0 ? (
            <div
              className="border-2 border-dashed border-theme rounded-lg p-10 text-center cursor-pointer hover:border-theme-tertiary transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault();
                handleFiles(e.dataTransfer.files);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <svg
                className="w-10 h-10 mx-auto mb-3 text-theme-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-theme-secondary text-sm">
                Drop files or click to browse
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file, i) => {
                const state = uploadState[file.name] || {};
                const isComplete = state.status === "complete";
                const isError = state.status === "error";
                const isActive = state.status === "uploading";
                return (
                  <div key={i} className="bg-theme-tertiary rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-theme-secondary rounded flex items-center justify-center flex-shrink-0">
                        {isComplete ? (
                          <svg
                            className="w-4 h-4 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : isError ? (
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        ) : isActive ? (
                          <div className="spinner w-4 h-4" />
                        ) : (
                          <svg
                            className="w-4 h-4 text-theme-muted"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-theme-primary text-sm truncate">
                          {file.name}
                        </p>
                        <p className="text-theme-muted text-xs">
                          {state.uploaded > 0
                            ? `${formatBytes(state.uploaded)} / ${formatBytes(
                                state.total
                              )}`
                            : formatBytes(file.size)}
                          {isActive && ` • ${state.percent}%`}
                          {isError && ` • ${state.error}`}
                        </p>
                      </div>
                      {!isUploading && !isComplete && (
                        <button
                          onClick={() => removeFile(i)}
                          className="text-theme-muted hover:text-theme-primary p-1"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    {isActive && (
                      <div className="mt-2 h-1 bg-theme-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-150"
                          style={{ width: `${state.percent}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {files.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-theme">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="text-theme-secondary hover:text-theme-primary text-sm disabled:opacity-50"
            >
              + Add files
            </button>
            <div className="flex gap-2">
              <button onClick={handleClose} className="btn-secondary text-sm">
                {isUploading ? "Cancel" : "Close"}
              </button>
              <button
                onClick={startUpload}
                disabled={files.length === 0 || isUploading}
                className="btn-primary text-sm"
              >
                {isUploading ? "Uploading..." : `Upload ${files.length}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
