import { Navigate, Outlet, redirect, useLoaderData } from "react-router-dom";
import { User } from "../types/user";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

async function getCurrentUser(authToken: string) {
  try {
    const response = await fetch(
      "https://solvent-nfkw.onrender.com/api/v1/current_user",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      },
    );

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function loader() {
  const authToken = localStorage.getItem("Authorization");

  if (!authToken) {
    return redirect("/login");
  }

  const data = await getCurrentUser(JSON.parse(authToken));
  return { data };
}

export default function UserLayout() {
  const { data } = useLoaderData() as { data: User };
  const { isAuthorized, logout } = useAuth();

  return isAuthorized() ? (
    <div className="flex justify-between">
      <Outlet context={{ data }} />
    </div>
  ) : (
    <Navigate to="/login" replace={true} />
  );
}
