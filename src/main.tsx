import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { typesafeBrowserRouter } from "react-router-typesafe";
import { RouterProvider } from "react-router-dom";
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
import Puzzles, {
  loader as allPuzzlesLoader,
  action as createPuzzleAction,
} from "./pages/Puzzles";
import SolvePuzzle, {
  loader as solvePuzzleLoader,
  action as solvePuzzleAction,
} from "./pages/Puzzle";
import Social from "./pages/Social";
import OtherUserDashboard, {
  loader as otherUserLoader,
  action as otherUserAction,
} from "./pages/OtherUserDashboard";
import OtherUserStats from "./pages/OtherUserStats";

const { router } = typesafeBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Login />
      </AuthProvider>
    ),
    action: loginAction,
  },
  {
    path: "/signup",
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
          {
            path: "social",
            element: <Social />,
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
        action: createPuzzleAction,
      },
      {
        path: "puzzles/:puzzleId",
        element: <SolvePuzzle />,
        loader: solvePuzzleLoader,
        action: solvePuzzleAction,
      },
      {
        path: "users/:userId",
        element: <OtherUserDashboard />,
        loader: otherUserLoader,
        action: otherUserAction,
        children: [
          {
            index: true,
            element: <OtherUserStats />,
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
          {
            path: "social",
            element: <Social />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div className="bg-gray-500 min-h-screen flex flex-col justify-between">
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
    <footer className="footer footer-center bg-gray-500 p-4">
      <aside>
        <p className="logo text-sm">
          Copyleft 🄯 {new Date().getFullYear()} - No rights reserved by Solvent
        </p>
      </aside>
    </footer>
  </div>,
);
