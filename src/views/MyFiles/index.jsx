import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useCustomQuery } from "../../TanstackQuery/QueryHooks";
import API_ENDPOINTS from "../../constant/apiEndpoints";
import FileList from "../../components/FileList/FileList";
import FilePreviewModal from "../../components/FilePreview/FilePreviewModal";
import Pagination from "../../components/Pagination/Pagination";
import Loading from "../../components/Loading/Loading";
import EmptyState from "../../components/EmptyState/EmptyState";

/**
 * MyFilesView - Displays user's uploaded files
 * Route: /drive/files
 */
const MyFilesView = () => {
  const { searchQuery, setShowUpload } = useOutletContext();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [previewFile, setPreviewFile] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(12);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(0);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: filesData, isLoading } = useCustomQuery({
    queryProps: {
      queryKey: ["files", "my-files", debouncedSearchQuery, page, limit],
      staleTime: 60 * 1000,
    },
    payload: {
      url: API_ENDPOINTS.MEDIA.LIST,
      params: { filename: debouncedSearchQuery, page, limit },
    },
  });

  const files = filesData?.media || [];
  const total = filesData?.total || 0;

  if (isLoading) {
    return <Loading message="Loading your files..." />;
  }

  if (files.length === 0) {
    return (
      <EmptyState
        icon={EmptyState.Icons.FILE}
        title="No files"
        message="Upload your first file to get started"
        action={
          <button onClick={() => setShowUpload(true)} className="btn-primary">
            Upload
          </button>
        }
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 overflow-auto">
        <FileList
          files={files}
          onFileDeleted={() => {}}
          onFileClick={setPreviewFile}
        />
      </div>

      <Pagination
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(0);
        }}
      />

      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
};

export default MyFilesView;
