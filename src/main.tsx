import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { typesafeBrowserRouter } from "react-router-typesafe";
import { Link, RouterProvider } from "react-router-dom";
import Login, { action as loginAction } from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import { Dashboard } from "./pages/Dashboard";

const { router } = typesafeBrowserRouter([
  {
    path: "/",
    element: <Link to={`/login`}>click me</Link>,
  },
  {
    path: "/login",
    element: <Login />,
    action: loginAction,
  },
  {
    path: "/dashboard",
    element: (
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
