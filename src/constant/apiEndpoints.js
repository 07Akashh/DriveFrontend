// API Endpoint Constants
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    SOCIAL_LOGIN: "auth/social",
    LOGOUT: "auth/logout",
  },
  // User
  USER: {
    PROFILE: "user/profile",
    STORAGE: "user/storage",
  },
  // Media
  MEDIA: {
    LIST: "media",
    SHARED_WITH_ME: "media/shared/with-me",
    TRASH_LIST: "media/trashed",
    DELETE: (id) => `media/${id}`,
    RESTORE: (id) => `media/${id}/restore`,
    PERMANENT_DELETE: (id) => `media/${id}/permanent`,
    SHARE_USERS: (id) => `media/${id}/share/users`,
    SHARE_LINK: (id) => `media/${id}/share/link`,
    GET_SHARES: (id) => `media/${id}/shares`,
    REVOKE_ACCESS: (id, userId) => `media/${id}/share/${userId}`,
    GET_BY_TOKEN: (token) => `media/share/${token}`,
    CHECK_ACCESS: (id) => `media/${id}/details`,
    REQUEST_ACCESS: (id) => `media/${id}/access/request`,
  },
};

export default API_ENDPOINTS;
