import React, { useState, useEffect, useRef } from "react";
import {
  useCustomQuery,
  useCustomMutation,
} from "../../TanstackQuery/QueryHooks";
import API_ENDPOINTS from "../../constant/apiEndpoints";
import { useAuth } from "../../context/AuthContext";

const ShareDialog = ({ file, onClose }) => {
  const { user } = useAuth();
  const [emails, setEmails] = useState("");
  const [permission, setPermission] = useState("download");
  const [generalAccess, setGeneralAccess] = useState("restricted");
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState(null);
  const [sharedUsers, setSharedUsers] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [copySuccess, setCopySuccess] = useState(false);
  const debounceRef = useRef(null);

  const { data: detailsData, refetch } = useCustomQuery({
    queryProps: { queryKey: ["fileDetails", file._id], enabled: !!file._id },
    payload: { url: API_ENDPOINTS.MEDIA.CHECK_ACCESS(file._id), method: "GET" },
  });

  useEffect(() => {
    if (detailsData?.media) {
      setGeneralAccess(detailsData.media.isPublic ? "public" : "restricted");
      setOwner(detailsData.media.owner);
      setSharedUsers(detailsData.media.sharedWith || []);
    }
  }, [detailsData]);

  const { mutation } = useCustomMutation();
  const isOwner = user?.email === file?.owner?.email;

  const handleShare = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const emailList = emails
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
      if (!emailList.length) {
        setMessage({ type: "error", text: "Enter at least one email" });
        setLoading(false);
        return;
      }
      const res = await mutation.mutateAsync({
        url: API_ENDPOINTS.MEDIA.SHARE_USERS(file._id),
        method: "POST",
        data: { emails: emailList, permission },
        wantToast: true,
      });
      if (res?.status === 200) {
        setMessage({ type: "success", text: "Shared" });
        setEmails("");
        refetch();
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed" });
    } finally {
      setLoading(false);
    }
  };

  const updateAccess = async (isPublic) => {
    try {
      setLoading(true);
      await mutation.mutateAsync({
        url: API_ENDPOINTS.MEDIA.SHARE_USERS(file._id),
        method: "POST",
        data: { isPublic },
        wantToast: true,
      });
      refetch();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAccessChange = (val) => {
    setGeneralAccess(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateAccess(val === "public"), 500);
  };

  const copyLink = () => {
    const link = `${window.location.origin}/file/${file._id}/view`;
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="card max-w-md w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-theme">
          <h2 className="text-theme-primary font-medium truncate pr-4">
            Share "{file.originalName}"
          </h2>
          <button
            onClick={onClose}
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

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {isOwner && (
            <form onSubmit={handleShare} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  placeholder="Add email"
                  className="input-field flex-1 text-sm"
                />
                <select
                  value={permission}
                  onChange={(e) => setPermission(e.target.value)}
                  className="input-field w-24 text-sm"
                >
                  <option value="download">Editor</option>
                  <option value="view">Viewer</option>
                </select>
                <button
                  type="submit"
                  disabled={loading || !emails}
                  className="btn-primary px-3 text-sm"
                >
                  Add
                </button>
              </div>
              {message.text && (
                <p
                  className={`text-xs ${
                    message.type === "error" ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {message.text}
                </p>
              )}
            </form>
          )}

          <div className="space-y-2">
            <h3 className="text-theme-muted text-xs font-medium uppercase">
              People with access
            </h3>
            {owner && (
              <div className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 rounded-full bg-theme-tertiary flex items-center justify-center text-theme-primary text-sm font-medium">
                  {owner.email?.[0]?.toUpperCase() || "O"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-theme-primary text-sm truncate">
                    {owner.email}
                  </p>
                  <p className="text-theme-muted text-xs">Owner</p>
                </div>
              </div>
            )}
            {sharedUsers.map((s, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 rounded-full bg-theme-secondary flex items-center justify-center text-theme-primary text-sm font-medium">
                  {s.email?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-theme-primary text-sm truncate">
                    {s.email}
                  </p>
                  <p className="text-theme-muted text-xs capitalize">
                    {s.permission}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-theme space-y-2">
            <h3 className="text-theme-muted text-xs font-medium uppercase">
              General access
            </h3>
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  generalAccess === "public"
                    ? "bg-green-900/30 text-green-400"
                    : "bg-theme-tertiary text-theme-muted"
                }`}
              >
                {generalAccess === "public" ? (
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
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <select
                  value={generalAccess}
                  disabled={!isOwner}
                  onChange={(e) => handleAccessChange(e.target.value)}
                  className="w-full bg-transparent text-theme-primary text-sm focus:outline-none cursor-pointer disabled:opacity-50"
                >
                  <option value="restricted" className="bg-theme-secondary">
                    Restricted
                  </option>
                  <option value="public" className="bg-theme-secondary">
                    Anyone with link
                  </option>
                </select>
                <p className="text-theme-muted text-xs">
                  {generalAccess === "public"
                    ? "Anyone with the link can view"
                    : "Only people with access"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-theme flex justify-between">
          <button
            onClick={copyLink}
            className={`btn-secondary flex items-center gap-2 text-sm ${
              copySuccess ? "text-green-400 border-green-600" : ""
            }`}
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
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
              />
            </svg>
            {copySuccess ? "Copied!" : "Copy link"}
          </button>
          <button onClick={onClose} className="btn-primary text-sm">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;
