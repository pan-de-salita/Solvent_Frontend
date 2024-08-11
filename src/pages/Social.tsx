import { Link, useOutletContext } from "react-router-dom";
import { User } from "../types/user";
import { useEffect, useState } from "react";
import { blo } from "blo";

export default function Social() {
  const { data } = useOutletContext() as { data: User };
  const [showFollowing, setShowFollowing] = useState(true);
  const [usersToShow, setUsersToShow] = useState(data.current_user.following);

  useEffect(() => {
    const dataToShow = showFollowing
      ? data.current_user.following
      : data.current_user.followers;
    setUsersToShow(dataToShow);
  }, [showFollowing]);

  return (
    <>
      <div className="md:min-h-[29rem] px-4 md:px-0 w-full mx-auto flex justify-center text-gray-100">
        <div className="bg-gray-400 rounded-lg md:mx-4 p-4 w-full max-w-5xl flex flex-col gap-4 md:flex-row md:gap-0 shadow-sm">
          <div className="min-w-[10rem] flex flex-row md:flex-col gap-2 md:gap-4">
            <div
              role="button"
              className={`btn btn-primary btn-sm text-sm ${showFollowing ? "pointer-events-none cursor-default" : "btn-outline"}`}
              onClick={() => setShowFollowing(true)}
            >
              Following: {data.current_user.following.length}
            </div>
            <div
              role="button"
              className={`btn btn-primary btn-sm text-sm ${!showFollowing ? "pointer-events-none cursor-default" : "btn-outline"}`}
              onClick={() => setShowFollowing(false)}
            >
              Followers: {data.current_user.followers.length}
            </div>
          </div>
          <div className="divider divider-horizontal"></div>
          <div className="w-full flex flex-col gap-4">
            {usersToShow.length > 0 && // Changed to > 0 to avoid rendering if empty
              usersToShow.map((user) => (
                <Link key={user.id} to={`/users/${user.id}`}>
                  <div className="w-full flex flex-col md:flex-row justify-between md:items-center">
                    <div className="flex items-center gap-2 md:gap-4">
                      <img
                        key={`${user.id}-avatar`}
                        alt={user.username}
                        src={blo(user.username as `0x${string}`)}
                        className="w-8 h-8 rounded-full"
                        tabIndex={0}
                      />
                      <span
                        key={`${user.id}-username`}
                        className="text-gray-100 text-md logo"
                      >
                        {user.username}
                      </span>
                    </div>
                    {user.most_used_language ? (
                      <div
                        key={`${user.id}-language`}
                        className="flex items-center gap-2"
                      >
                        <span className="text-gray-100 text-sm md:text-md logo">
                          Most Used Language:
                        </span>
                        <i
                          key={`${user.id}-language-icon`}
                          className={`devicon-${user.most_used_language.toLowerCase() === "c++" ? "cplusplus" : user.most_used_language.toLowerCase()}-plain text-gray-100 text-md p-2 bg-gray-900 rounded-lg`}
                        ></i>
                      </div>
                    ) : (
                      <span
                        key={`${user.id}-no-language`}
                        className="text-gray-100 text-sm md:text-md logo"
                      >
                        No puzzles solved yet.
                      </span>
                    )}
                  </div>
                  <div className="divider m-0"></div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
