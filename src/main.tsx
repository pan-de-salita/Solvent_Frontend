import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { typesafeBrowserRouter } from "react-router-typesafe";
import { Link, RouterProvider } from "react-router-dom";
import Login, { action as loginAction } from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup, { action as signupAction } from "./pages/Signup";
import UserLayout, { loader as dashboardLoader } from "./layouts/UserLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { action as logoutAction } from "./pages/Logout";
import Stats from "./pages/Stats";

const { router } = typesafeBrowserRouter([
  {
    path: "/",
    element: <Link to={`/login`}>click me</Link>,
  },
  {
    path: "signup",
    element: (
      <AuthProvider>
        <Signup />
      </AuthProvider>
    ),
    action: signupAction,
  },
  {
    path: "login",
    element: (
      <AuthProvider>
        <Login />
      </AuthProvider>
    ),
    action: loginAction,
  },
  {
    path: "dashboard",
    element: (
      <AuthProvider>
        <UserLayout />
      </AuthProvider>
    ),
    loader: dashboardLoader,
    children: [
      {
        path: "stats",
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <Stats />,
          },
        ],
      },
      {
        path: "logout",
        action: logoutAction,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
