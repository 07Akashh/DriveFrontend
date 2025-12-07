import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useCustomQuery } from "../../TanstackQuery/QueryHooks";
import API_ENDPOINTS from "../../constant/apiEndpoints";
import FileList from "../../components/FileList/FileList";
import FilePreviewModal from "../../components/FilePreview/FilePreviewModal";
import Pagination from "../../components/Pagination/Pagination";
import Loading from "../../components/Loading/Loading";
import EmptyState from "../../components/EmptyState/EmptyState";

const SharedView = () => {
  const { searchQuery } = useOutletContext();
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
      queryKey: [ "shared", debouncedSearchQuery, page, limit],
      staleTime: 60 * 1000,
    },
    payload: {
      url: API_ENDPOINTS.MEDIA.SHARED_WITH_ME,
      params: { filename: debouncedSearchQuery, page, limit },
    },
  });

  const files = filesData?.media || [];
  const total = filesData?.total || 0;

  if (isLoading) {
    return <Loading message="Loading shared files..." />;
  }

  if (files.length === 0) {
    return (
      <EmptyState
        icon={EmptyState.Icons.SHARE}
        title="No shared files"
        message="Files shared with you will appear here"
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 overflow-auto">
        <FileList
          files={files}
          onFileDeleted={() => {}}
          isSharedView={true}
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

export default SharedView;
