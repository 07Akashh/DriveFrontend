import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useUserProfile, useStorageInfo, useLogout } from "../hooks/useAuth";
import FileUpload from "../components/FileUpload/FileUpload";
import { useQueryClient } from "@tanstack/react-query";

const MainLayout = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { data: userProfileData } = useUserProfile();
  const { data: storageInfoData, refetch: refetchStorage } = useStorageInfo();
  const { logout } = useLogout();
  const queryClient = useQueryClient();
  const location = useLocation();

  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get current view from URL path
  const currentPath = location.pathname.split("/").pop();

  const userProfile = userProfileData?.data?.user || user;
  const storageInfo = storageInfoData?.data?.storage;

  const handleLogout = async () => await logout();

  const handleUploadComplete = () => {
    setShowUpload(false);
    queryClient.invalidateQueries({ queryKey: ["files"] });
    refetchStorage();
  };

  const formatStorage = (used, total) => {
    if (!used || !total) return "0 / 5 GB";
    const usedGB = (used / (1024 * 1024 * 1024)).toFixed(2);
    const totalGB = (total / (1024 * 1024 * 1024)).toFixed(0);
    return `${usedGB} / ${totalGB} GB`;
  };

  const getStoragePercentage = (used, total) => {
    if (!used || !total) return 0;
    return Math.min((used / total) * 100, 100);
  };

  // Navigation items with route paths
  const navItems = [
    {
      path: "files",
      icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
      label: "My Files",
    },
    {
      path: "shared",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
      label: "Shared with me",
    },
    {
      path: "trash",
      icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
      label: "Trash",
    },
  ];

  return (
    <div className="flex h-screen bg-theme-primary">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-theme-secondary border-r border-theme flex flex-col transform transition-transform lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-theme flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-theme-primary rounded-lg flex items-center justify-center border border-theme">
              <svg
                className="w-5 h-5 text-theme-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
              </svg>
            </div>
            <span className="text-theme-primary font-semibold">Drive</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-theme-secondary hover:text-theme-primary p-1"
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

        <div className="p-3">
          <button
            onClick={() => {
              setShowUpload(true);
              setSidebarOpen(false);
            }}
            className="w-full btn-primary flex items-center justify-center gap-2 py-2.5"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Upload
          </button>
        </div>

        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-auto hide-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={`/drive/${item.path}`}
              onClick={() => setSidebarOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                currentPath === item.path
                  ? "bg-theme-tertiary text-theme-primary"
                  : "text-theme-secondary hover:bg-theme-tertiary hover:text-theme-primary"
              }`}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d={item.icon}
                />
              </svg>
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        {storageInfo && (
          <div className="p-3 border-t border-theme">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-theme-muted">Storage</span>
              <span className="text-theme-secondary">
                {formatStorage(storageInfo.used, storageInfo.total)}
              </span>
            </div>
            <div className="h-1 bg-theme-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: `${getStoragePercentage(
                    storageInfo.used,
                    storageInfo.total
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="p-3 border-t border-theme">
          <div
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-theme-tertiary cursor-pointer"
            onClick={handleLogout}
          >
            <div className="w-8 h-8 rounded-full bg-theme-tertiary flex items-center justify-center text-theme-primary text-sm font-medium">
              {userProfile?.displayName?.charAt(0) ||
                user?.email?.charAt(0) ||
                "U"}
            </div>
            <div className="flex-1 min-w-0 hidden sm:block">
              <p className="text-theme-primary text-sm truncate">
                {userProfile?.displayName || "User"}
              </p>
              <p className="text-theme-muted text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-theme-secondary border-b border-theme px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-theme-secondary hover:text-theme-primary p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <h1 className="text-lg font-medium text-theme-primary capitalize hidden sm:block">
            {currentPath === "files" ? "My Files" : currentPath}
          </h1>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9 pr-3 py-2 text-sm"
              />
              <svg
                className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="text-theme-secondary hover:text-theme-primary p-2"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
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
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
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
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="text-theme-secondary hover:text-theme-primary p-2 hidden sm:block"
            title="Logout"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6 scrollbar">
          <Outlet context={{ view: currentPath, searchQuery, setShowUpload }} />
        </div>
      </main>

      {showUpload && (
        <FileUpload
          onClose={() => setShowUpload(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  );
};

export default MainLayout;
