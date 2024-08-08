import {
  Link,
  Outlet,
  useLocation,
  useNavigation,
  useOutletContext,
} from "react-router-dom";
import { User } from "../types/user";
import { blo } from "blo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDna } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const { data } = useOutletContext() as { data: User };
  const location = useLocation();
  const navigation = useNavigation();

  return (
    <>
      <div className="w-full flex flex-col items-center py-4">
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
                <div className="badge badge-warning badge-outline">
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
                <span className="text-lg logo">
                  Have you solved a puzzle today?
                </span>
                <span className="text-sm">
                  Remember: A puzzle a day keeps impostor syndrome at bay.
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
              target="_blank"
              className="h-full"
            >
              <div
                role="button"
                className="h-full flex flex-col justify-center gap-2 p-4 rounded-lg bg-gray-400 w-full md:max-w-xs"
              >
                <span className="text-lg text-blue-500 logo">
                  Read from the app's inspiration:
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
          <div className="rounded-lg mx-2 w-full max-w-5xl">
            <ul className="menu menu-horizontal rounded-box gap-2">
              <li>
                <Link
                  to="/dashboard/"
                  className={`${location.pathname === "/dashboard/" ? "bg-gray-300" : ""} logo`}
                >
                  Stats
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/completed_solutions"
                  className={`${location.pathname === "/dashboard/completed_solutions" ? "bg-gray-300" : ""} logo`}
                >
                  Solutions
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/created_puzzles"
                  className={`${location.pathname === "/dashboard/created_puzzles" ? "bg-gray-300" : ""} logo`}
                >
                  Puzzles
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* outlet */}
        <div
          className={`${navigation.state == "loading" ? "blur-sm" : ""} w-full`}
        >
          <Outlet context={{ data }} />
        </div>
      </div>
    </>
  );
}
