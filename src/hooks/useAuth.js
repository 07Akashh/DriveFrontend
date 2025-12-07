import { signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { useCustomMutation, useCustomQuery } from "../TanstackQuery/QueryHooks";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../constant/apiEndpoints";
import { useAuth } from "../context/AuthContext";

/**
 * Hook for Google login with backend integration
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { mutation, queryClient } = useCustomMutation({
    onSuccess: (data) => {
      // console.log(data)
        login(data);

      queryClient.invalidateQueries({ queryKey: ["user-profile"] });

      navigate("/drive");
    },
    onError: (error) => {
      console.error("❌ Login failed:", error);
    },
  });

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      // Call backend with Firebase token
      mutation.mutate({
        method: "POST",
        wantToast: true,
        url: API_ENDPOINTS.AUTH.SOCIAL_LOGIN,
        headers: { fbToken: token },
      });
    } catch (error) {
      console.error("❌ Google login failed:", error);
      throw error;
    }
  };

  return {
    loginWithGoogle,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};

/**
 * Hook for logout
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const { logout: contextLogout } = useAuth();

  const { mutation, queryClient } = useCustomMutation({
    onSuccess: () => {
      // Use context logout
      contextLogout();

      // Sign out from Firebase (optional, but good for cleanup)
      firebaseSignOut(auth).catch((err) =>
        console.error("Firebase signout error", err)
      );

      // Clear all queries
      queryClient.clear();

      // Navigate to landing page
      navigate("/", { replace: true });
    },
  });

  const logout = async () => {
    try {
      // Call backend logout endpoint
      mutation.mutate({
        method: "POST",
        wantToast: true,
        url: API_ENDPOINTS.AUTH.LOGOUT,
      });
    } catch (error) {
      console.error("❌ Logout failed:", error);
      // Even if backend fails, clear local state
      contextLogout();
      firebaseSignOut(auth).catch((err) =>
        console.error("Firebase signout error", err)
      );
      queryClient.clear();
      navigate("/", { replace: true });
    }
  };

  return {
    logout,
    isLoading: mutation.isPending,
  };
};

/**
 * Hook to fetch user profile
 */
export const useUserProfile = () => {
  const { isLoggedIn } = useAuth();
  return useCustomQuery({
    queryProps: {
      queryKey: ["user-profile"],
      enabled: isLoggedIn, // Only fetch if logged in
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    payload: {
      url: API_ENDPOINTS.USER.PROFILE,
    },
  });
};

/**
 * Hook to fetch storage info
 */
export const useStorageInfo = () => {
  const { isLoggedIn } = useAuth();
  return useCustomQuery({
    queryProps: {
      queryKey: ["storage-info"],
      enabled: isLoggedIn,
      staleTime: 2 * 60 * 1000, // 2 minutes
    },
    payload: {
      url: API_ENDPOINTS.USER.STORAGE,
    },
  });
};
