import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { typesafeBrowserRouter } from "react-router-typesafe";
import { Link, RouterProvider } from "react-router-dom";
import Login, { action as loginAction } from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup, { action as signupAction } from "./pages/Signup";
import UserLayout, { loader as userLayoutLoader } from "./layouts/UserLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { action as logoutAction } from "./pages/Logout";
import Stats from "./pages/Stats";
import CompletedSolutions, {
  loader as completedSolutionsLoader,
} from "./pages/CompletedSolutions";
import CreatedPuzzles, {
  loader as createdPuzzlesLoader,
} from "./pages/CreatedPuzzles";
import Puzzles, { loader as allPuzzlesLoader } from "./pages/Puzzles";

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
    path: "",
    element: (
      <AuthProvider>
        <UserLayout />
      </AuthProvider>
    ),
    loader: userLayoutLoader,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <Stats />,
          },
          {
            path: "completed_solutions",
            element: <CompletedSolutions />,
            loader: completedSolutionsLoader,
          },
          {
            path: "created_puzzles",
            element: <CreatedPuzzles />,
            loader: createdPuzzlesLoader,
          },
        ],
      },
      {
        path: "logout",
        action: logoutAction,
      },
      {
        path: "puzzles",
        element: <Puzzles />,
        loader: allPuzzlesLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div className="bg-gray-500 min-h-screen">
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </div>,
);
