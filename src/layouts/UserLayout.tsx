import {
  Form,
  Link,
  Navigate,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
} from "react-router-dom";
import { User } from "../types/user";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVial,
  faMicroscope,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";
import { blo } from "blo";

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
    return redirect("/");
  }

  const data = await getCurrentUser(JSON.parse(authToken));
  return { data };
}

export default function UserLayout() {
  const { data } = useLoaderData() as { data: User };
  const { isAuthorized } = useAuth();
  const location = useLocation();

  return isAuthorized() && data ? (
    <div className="drawer bg-gray-500">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-gray-800 w-full px-2 flex justify-between items-center">
          <div className="lg:pl-4">
            <div className="flex-none pr-2">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="md:inline-block h-6 w-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex items-center justify-center gap-1 text-red-500">
              <FontAwesomeIcon
                icon={faVial}
                className="md:block rounded-md border-2 border-red-500 text-red-500 p-1 text-xs"
              />
              <span className="logo text-2xl text-red-500">solvent</span>
              <span className="hidden md:block pl-1 pt-1 logo text-lg text-gray-200">
                powered by Judge0
              </span>
            </div>
          </div>
          <div>
            <div className="dropdown dropdown-end h-full">
              <div
                className="tooltip tooltip-left rounded-lg mr-0 lg:mr-4 p-3 h-full btn-ghost"
                data-tip={`What's cooking, ${data.current_user.username}?`}
              >
                <img
                  alt={data.current_user.username}
                  src={blo(data.current_user.username as `0x${string}`)}
                  className="w-8 h-8 rounded-full"
                  role="button"
                  tabIndex={0}
                />
              </div>
              <ul
                tabIndex={0}
                className="rounded-lg dropdown-content menu bg-gray-800 z-[1] w-40 p-2 shadow border-[1px] border-gray-200"
              >
                <Form
                  method="delete"
                  action="logout"
                  onSubmit={(event) => {
                    if (!confirm("Please confirm you want to log out.")) {
                      event.preventDefault();
                    }
                  }}
                >
                  <button type="submit" className="w-full">
                    Log out
                  </button>
                </Form>
              </ul>
            </div>
          </div>
        </div>
        {/* Page content here */}
        <Outlet context={{ data }} />
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-gray-800 min-h-full w-80">
          {/* Sidebar content here */}
          <li>
            <Link
              to="/dashboard/"
              className={`${location.pathname.includes("/dashboard/") ? "border-red-500" : "border-transparent"} border-4 border-t-0 border-r-0 border-b-0 rounded-none flex justify-start items-center`}
            >
              <FontAwesomeIcon
                icon={faBrain}
                className="text-gray-100 text-3xl pr-3"
              />
              <div className="flex flex-col items-start">
                <span className="text-lg logo text-gray-100">Home</span>
                <span className="text-xs font-medium text-gray-100">
                  Report back to see your stats and progress.
                </span>
              </div>
            </Link>
          </li>
          <div className="divider"></div>
          <li>
            <Link
              to="/puzzles/"
              className={`${location.pathname.includes("/puzzles/") ? "border-red-500" : "border-transparent"} border-4 border-t-0 border-r-0 border-b-0 rounded-none flex justify-start items-center`}
            >
              <FontAwesomeIcon
                icon={faMicroscope}
                className="text-3xl pr-3 text-gray-100"
              />
              <div className="flex flex-col items-start">
                <span className="text-lg logo text-gray-100">Puzzles</span>
                <span className="text-xs font-medium text-gray-100">
                  Complete challenging puzzles. Retrain to hone technique.
                </span>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  ) : (
    <Navigate to="/" replace={true} />
  );
}
