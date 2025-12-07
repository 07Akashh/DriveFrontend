import React, { useState, useEffect } from "react";
import ShareDialog from "../ShareDialog/ShareDialog";
import api from "../../services/api";
import { auth } from "../../config/firebase";

const FilePreviewModal = ({ file, onClose }) => {
  const [showShare, setShowShare] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const user = auth.currentUser;
        if (user) setToken(await user.getIdToken());
      } catch (e) {
        console.error("Token error:", e);
      }
    };
    getToken();
  }, []);

  if (!file) return null;

  const isImage = file.mimeType?.startsWith("image/");
  const isVideo = file.mimeType?.startsWith("video/");
  const isPDF = file.mimeType === "application/pdf";

  const getUrl = (type) => {
    const path = type === "download" ? file.downloadUrl : file.streamUrl;
    const baseUrl = `${api.defaults.baseURL}${path}`;
    return token ? `${baseUrl}?token=${encodeURIComponent(token)}` : baseUrl;
  };

  return (
    <div className="fixed inset-0 bg-theme-primary z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-theme">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="text-theme-secondary hover:text-theme-primary p-1"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-theme-primary text-sm sm:text-base font-medium truncate">
            {file.originalName}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShare(true)}
            className="btn-primary px-3 py-1.5 text-sm hidden sm:flex items-center gap-2"
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Share
          </button>
          <a
            href={getUrl("download")}
            download
            className="text-theme-secondary hover:text-theme-primary p-2"
            title="Download"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </a>
          <button
            onClick={onClose}
            className="text-theme-secondary hover:text-theme-primary p-2 sm:hidden"
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
      </div>
      <div className="flex-1 bg-white bg-opacity-25 dark:bg-gray-700 dark:bg-opacity-25 flex items-center justify-center p-4 overflow-auto">
        {isImage && (
          <img
            src={getUrl("stream")}
            alt={file.originalName}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        )}
        {isVideo && (
          <video
            src={getUrl("stream")}
            controls
            autoPlay
            className="max-w-full max-h-full rounded-lg"
          />
        )}
        {isPDF && (
          <iframe
            src={getUrl("stream") + "#toolbar=0"}
            title={file.originalName}
            className="w-full bg-white"
            style={{ maxWidth: "850px", height: "calc(100vh - 100px)" }}
          />
        )}
        {!isImage && !isVideo && !isPDF && (
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto text-theme-muted mb-4"
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
            <p className="text-theme-secondary mb-4">Preview not available</p>
            <a href={getUrl("download")} download className="btn-primary">
              Download
            </a>
          </div>
        )}
      </div>
      {showShare && (
        <ShareDialog file={file} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
};

export default FilePreviewModal;
