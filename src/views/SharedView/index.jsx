import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useCustomMutation, useCustomQuery } from "../../TanstackQuery/QueryHooks";
import API_ENDPOINTS from "../../constant/apiEndpoints";
import api from "../../services/api";
import { auth } from "../../config/firebase";

const SharedFileViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [accessStatus, setAccessStatus] = useState(null);

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

  const getUrl = (path) => {
    const baseUrl = `${api.defaults.baseURL}${path}`;
    return token ? `${baseUrl}?token=${encodeURIComponent(token)}` : baseUrl;
  };

  const {
    data: fileData,
    isLoading,
    error,
  } = useCustomQuery({
    queryProps: {
      queryKey: ["fileAccess", id],
      retry: false,
      enabled: !!id,
    },
    payload: {
      url: API_ENDPOINTS.MEDIA.CHECK_ACCESS(id),
      method: "GET",
    },
  });

  React.useEffect(() => {
    if (fileData) {
      if (fileData.hasAccess) {
        setAccessStatus(fileData.accessType);
      } else {
        setAccessStatus(fileData.accessType || "forbidden");
      }
    }
  }, [fileData]);

  React.useEffect(() => {
    if (error) {
      if (error.cause?.status === 401) setAccessStatus("unauthorized");
      else if (error.cause?.status === 403) setAccessStatus("forbidden");
      else toast.error("Failed to load file details");
    }
  }, [error]);

  const { mutation: accessMutation } = useCustomMutation();

  const handleRequestAccess = async () => {
    try {
      await accessMutation.mutateAsync({
        url: API_ENDPOINTS.MEDIA.REQUEST_ACCESS(id),
        method: "POST",
        wantToast: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginRedirect = () =>
    navigate(`/login?returnUrl=/file/${id}/view`);

  if (isLoading) {
    return (
      <div className="loader">
        <div className="spinner w-8 h-8" />
      </div>
    );
  }

  if (error && !accessStatus) {
    return (
      <div className="loader flex-col gap-4">
        <svg
          className="w-16 h-16 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-theme-secondary">
          {error.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  if (accessStatus === "unauthorized") {
    return (
      <div className="loader">
        <div className="card max-w-md w-full p-8 mx-4 text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-theme-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h2 className="text-xl font-medium text-theme-primary mb-2">
            Sign in required
          </h2>
          <p className="text-theme-secondary text-sm mb-6">
            Sign in to view or request access to this file.
          </p>
          <button onClick={handleLoginRedirect} className="btn-primary w-full">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (accessStatus === "forbidden") {
    return (
      <div className="loader">
        <div className="card max-w-md w-full p-8 mx-4 text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h2 className="text-xl font-medium text-theme-primary mb-2">
            Access required
          </h2>
          <p className="text-theme-secondary text-sm mb-2">
            Ask the owner for access.
          </p>
          {fileData?.media?.owner?.email && (
            <p className="text-theme-muted text-xs mb-6">
              Owner: {fileData.media.owner.email}
            </p>
          )}
          <button
            onClick={handleRequestAccess}
            disabled={accessMutation.isPending}
            className="btn-primary w-full"
          >
            {accessMutation.isPending ? "Sending..." : "Request Access"}
          </button>
        </div>
      </div>
    );
  }

  const { media } = fileData;
  const isImage = media?.mimeType?.startsWith("image/");
  const isVideo = media?.mimeType?.startsWith("video/");
  const isAudio = media?.mimeType?.startsWith("audio/");
  const isPDF = media?.mimeType === "application/pdf";

  const streamUrl = getUrl(media?.streamUrl || `/proxy/media/${id}/stream`);
  const downloadUrl = getUrl(
    media?.downloadUrl || `/proxy/media/${id}/download`
  );

  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-theme-primary">
      <header className="bg-theme-secondary border-b border-theme px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-theme-tertiary rounded-lg flex-shrink-0">
            {isImage ? (
              <svg
                className="w-5 h-5 text-blue-400"
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
            ) : isVideo ? (
              <svg
                className="w-5 h-5 text-purple-400"
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
            ) : isAudio ? (
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-theme-secondary"
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
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-theme-primary font-medium truncate">
              {media?.originalName}
            </h1>
            <p className="text-theme-muted text-xs">
              {formatBytes(media?.size)} •{" "}
              {new Date(media?.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <a
          href={downloadUrl}
          download
          className="btn-primary flex items-center gap-2 flex-shrink-0"
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span className="hidden sm:inline">Download</span>
        </a>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        {isImage && (
          <img
            src={streamUrl}
            alt={media?.originalName}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        )}
        {isVideo && (
          <video
            src={streamUrl}
            controls
            autoPlay
            className="max-w-full max-h-full rounded-lg"
          />
        )}
        {isAudio && (
          <audio src={streamUrl} controls className="w-full max-w-md" />
        )}
        {isPDF && (
          <iframe
            src={streamUrl + "#toolbar=0"}
            title={media?.originalName}
            className="w-full border-0 bg-white shadow-lg"
            style={{ maxWidth: "850px", height: "calc(100vh - 100px)" }}
          />
        )}
        {!isImage && !isVideo && !isAudio && !isPDF && (
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
            <p className="text-theme-secondary mb-4">No preview available</p>
            <a href={downloadUrl} download className="btn-primary">
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedFileViewer;
