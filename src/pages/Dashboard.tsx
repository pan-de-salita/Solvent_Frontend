import { Link, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { User } from "../types/user";
import { blo } from "blo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDna } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const { data } = useOutletContext() as { data: User };
  const location = useLocation();

  return (
    <>
      <div className="w-full min-h-screen flex flex-col items-center py-4">
        {/* profile */}
        <div className="my-2 w-full md:h-44 mx-auto flex justify-center text-gray-100">
          <div className="bg-gray-900 rounded-lg mx-4 p-4 w-full max-w-5xl flex gap-4 shadow-sm">
            <div className="w-16 h-16">
              <img
                alt={data.current_user.username}
                src={blo(data.current_user.username as `0x${string}`)}
                className="rounded-full mt-2"
                tabIndex={0}
              />
            </div>
            <div className="w-full flex flex-col justify-start gap-2">
              <span className="text-3xl logo pb-1">
                {data.current_user.username}
              </span>
              <div className="w-full flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm">
                    Email: {data.current_user.email}
                  </span>
                  <span className="text-sm">
                    Member Since:{" "}
                    {new Date(data.current_user.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                      },
                    )}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm">
                    Following: {data.current_user.following.length}
                  </span>
                  <span className="text-sm">
                    Followers: {data.current_user.followers.length}
                  </span>
                </div>
                <div className="w-0 md:w-8"></div>
              </div>
              <div className="pt-2 text-sm">
                Most Used Language:{" "}
                <div className="badge badge-primary badge-outline">
                  {data.current_user.stats.most_used_language
                    ? data.current_user.stats.most_used_language
                    : "null"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-2 w-full md:h-36 mx-auto flex justify-center text-gray-100">
          <div className="rounded-lg mx-4 w-full max-w-5xl flex flex-col md:flex-row gap-4 shadow-sm">
            <div className="flex items-center p-4 rounded-l-lg bg-gradient-to-r from-[#1D1D1F] to-[#16171B] flex-grow">
              <FontAwesomeIcon icon={faDna} className="text-5xl pl-2 pr-6" />
              <div className="flex flex-col gap-1">
                <span className="font-bold text-md text-red-500">
                  Have you solved a puzzle today?
                </span>
                <span className="text-sm">
                  Remember: a puzzle a day keeps the impostor syndrome away.
                </span>
                <div className="pt-2 text-sm">
                  <button className="btn btn-outline btn-primary btn-xs">
                    SOLVE RANDOM PUZZLE
                  </button>
                </div>
              </div>
            </div>
            <a
              href="https://www.codewars.com/post/8-reasons-why-codewarriors-practice-coding-with-codewars"
              className="h-full"
            >
              <div
                role="button"
                className="h-full flex flex-col justify-center gap-2 px-4 py-5 rounded-lg bg-gray-400 w-full md:max-w-xs"
              >
                <span className="text-md font-bold">
                  Read from this app's inspiration:
                </span>
                <span className="text-sm">
                  8 Reasons Why Codewarriors Practice Coding with Codewars
                </span>
              </div>
            </a>
          </div>
        </div>
        {/* menu */}
        <div className="my-2 w-full mx-auto flex justify-center text-gray-100">
          <div className="rounded-lg mx-4 w-full max-w-5xl flex gap-4">
            <ul className="menu menu-horizontal rounded-box gap-2">
              <li>
                <Link
                  to="/dashboard/stats"
                  className={
                    location.pathname == "/dashboard/stats" ? "bg-gray-300" : ""
                  }
                >
                  Stats
                </Link>
              </li>
              <li>
                <a>Item 2</a>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div>
        </div>
        {/* outlet */}
        <Outlet context={{ data }} />
      </div>
    </>
  );
}
