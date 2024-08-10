import {
  Form,
  Link,
  Outlet,
  redirect,
  useLoaderData,
  useOutletContext,
} from "react-router-dom";
import { OtherUser, User } from "../types/user";
import { blo } from "blo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDna } from "@fortawesome/free-solid-svg-icons";

async function getUser(userId: number, authToken: string) {
  try {
    const response = await fetch(
      `https://solvent-nfkw.onrender.com/api/v1/users/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      },
    );

    const data = await response.json();
    return data.data.user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function loader({ params }: { params: any }) {
  const authToken = localStorage.getItem("Authorization");

  if (!authToken) {
    return redirect("/");
  }

  const otherUser = await getUser(
    JSON.parse(params.userId),
    JSON.parse(authToken),
  );

  return { otherUser };
}

async function destroyRelationship(
  relationshipToDestroy: { relationship_id: number },
  authToken: string,
) {
  console.log(relationshipToDestroy);
  try {
    const response = await fetch(
      `https://solvent-nfkw.onrender.com/api/v1/relationships/${relationshipToDestroy.relationship_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      },
    );

    console.log(response);
    return response;
  } catch (error) {
    return error as Error;
  }
}

async function createRelationship(
  newRelationship: {
    followed_id: number;
  },
  authToken: string,
) {
  try {
    const response = await fetch(
      "https://solvent-nfkw.onrender.com/api/v1/relationships",
      {
        method: "POST",
        body: JSON.stringify({ relationship: newRelationship }),
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      },
    );

    console.log(response);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    return error as Error;
  }
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const newRelationship = Object.fromEntries(formData) as {
    followed_id: string;
    relationship_id: string;
    following: string;
  };
  const formattedRelationship = {
    followed_id: Number(newRelationship.followed_id),
  };
  const authToken = localStorage.getItem("Authorization");

  if (authToken) {
    if (newRelationship.following === "yes") {
      const formattedRelationshipToDestroy = {
        relationship_id: Number(newRelationship.relationship_id),
      };
      await destroyRelationship(
        formattedRelationshipToDestroy,
        JSON.parse(authToken),
      );
    } else if (newRelationship.following === "no") {
      await createRelationship(formattedRelationship, JSON.parse(authToken));
    }
  }

  return redirect(`/users/${formattedRelationship.followed_id}`);
}

export default function OtherUserDashboard() {
  const { data } = useOutletContext() as { data: User };
  const { otherUser } = useLoaderData() as { otherUser: OtherUser };

  return (
    <>
      <div className="w-full flex flex-col items-center py-4">
        {/* profile */}
        <div className="my-2 w-full md:h-44 mx-auto flex justify-center text-gray-100">
          <div className="bg-gray-900 rounded-lg mx-4 p-4 w-full max-w-5xl flex gap-4 shadow-sm">
            <div className="w-16 h-16">
              <img
                alt={otherUser.username}
                src={blo(otherUser.username as `0x${string}`)}
                className="rounded-full mt-2"
                tabIndex={0}
              />
            </div>
            <div className="w-full flex flex-col justify-start gap-2">
              <span className="text-3xl logo pb-1">{otherUser.username}</span>
              <div className="w-full flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm">Email: {otherUser.email}</span>
                  <span className="text-sm">
                    Member Since:{" "}
                    {new Date(otherUser.created_at).toLocaleDateString(
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
                    Following: {otherUser.following.length}
                  </span>
                  <span className="text-sm">
                    Followers: {otherUser.followers.length}
                  </span>
                </div>
                <div className="w-0 md:w-8"></div>
              </div>
              <div className="pt-2 text-sm">
                <Form method="post" id="follow-form" className="flex flex-col">
                  <input
                    type="hidden"
                    name="followed_id"
                    defaultValue={otherUser.id}
                  />
                  {!data.current_user.following
                    .map((f) => f.id)
                    .includes(otherUser.id) ? (
                    <div className="flex">
                      <input
                        type="hidden"
                        name="following"
                        defaultValue={"no"}
                      />
                      <button
                        type="submit"
                        className="btn-md md:btn-sm btn btn-warning btn-outline"
                      >
                        Follow
                      </button>
                    </div>
                  ) : (
                    <div className="flex">
                      <input
                        type="hidden"
                        name="following"
                        defaultValue={"yes"}
                      />
                      <input
                        type="hidden"
                        name="relationship_id"
                        defaultValue={
                          data.current_user.active_relationships.find(
                            (active_relationship) =>
                              active_relationship.followed_id === otherUser.id,
                          )?.id || ""
                        }
                      />
                      <button
                        type="submit"
                        className="btn-md md:btn-sm btn btn-error btn-outline"
                      >
                        Unfollow
                      </button>
                    </div>
                  )}{" "}
                </Form>
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
                <div className="pt-4 text-sm">
                  <Link to="/puzzles/">
                    <button className="btn btn-outline btn-primary btn-sm">
                      Solve a puzzle
                    </button>
                  </Link>
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
                className="h-full flex flex-col justify-center gap-2 p-4 rounded-lg bg-gray-400 w-full md:max-w-xs shadow-sm"
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

        {/* outlet */}
        <Outlet context={{ data, otherUser }} />
      </div>
    </>
  );
}
