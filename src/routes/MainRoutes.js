import { lazy } from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import AuthLayout from "../layout/AuthLayout";
import Loadable from "../components/Loading/Loadable";


const HomePage = Loadable(lazy(() => import("../views/Home")));
const SharedFileViewer = Loadable(lazy(() => import("../views/SharedView")));
const MyFilesView = Loadable(lazy(() => import("../views/MyFiles")));
const SharedView = Loadable(lazy(() => import("../views/Shared")));
const TrashView = Loadable(lazy(() => import("../views/Trash")));

const MainRoutes = (isLoggedIn, user, accessToken) => [
  {
    path: "/",
    element:
      isLoggedIn && user && accessToken ? (
        <Navigate to="/drive/files" replace />
      ) : (
        <AuthLayout />
      ),
    children: [{ path: "/", element: <HomePage /> }],
  },

  {
    path: "/drive",
    element:
      isLoggedIn && user && accessToken ? (
        <MainLayout />
      ) : (
        <Navigate to="/" replace />
      ),
    children: [
      { index: true, element: <Navigate to="files" replace /> },
      { path: "files", element: <MyFilesView /> },
      { path: "shared", element: <SharedView /> },
      { path: "trash", element: <TrashView /> },
    ],
  },

  { path: "/file/:id/view", element: <SharedFileViewer /> },

  { path: "*", element: <Navigate to="/" replace /> },
];

export default MainRoutes;
