import {
  Form,
  Link,
  redirect,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { Puzzle } from "../types/puzzle";

async function getAllPuzzes(q: string | null) {
  try {
    const response = await fetch(
      "https://solvent-nfkw.onrender.com/api/v1/puzzles",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    const allPuzzles = data.data.all_puzzles;

    if (!q) {
      return allPuzzles;
    }

    const filteredPuzzles = allPuzzles.filter((puzzle: Puzzle) =>
      (
        puzzle.title.toLowerCase() +
        puzzle.tags.reduce((acc, curr) => acc + " " + curr, "")
      ).includes(q),
    );

    return filteredPuzzles;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const allPuzzData = await getAllPuzzes(q);
  return { allPuzzData, q };
}

async function createPuzzle(
  newPuzzle: {
    title: string;
    description: string;
    expected_output: string;
  },
  authToken: string,
) {
  try {
    const response = await fetch(
      "https://solvent-nfkw.onrender.com/api/v1/puzzles",
      {
        method: "POST",
        body: JSON.stringify({ puzzle: newPuzzle }),
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      },
    );

    return response;
  } catch (error) {
    return error as Error;
  }
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const newPuzzle = Object.fromEntries(formData) as {
    title: string;
    description: string;
    expected_output: string;
  };
  const authToken = localStorage.getItem("Authorization");

  if (authToken) {
    await createPuzzle(newPuzzle, JSON.parse(authToken));
  }

  return redirect(`/puzzles/`);
}

export default function Puzzles() {
  const { allPuzzData, q } = useLoaderData() as {
    allPuzzData: Puzzle[];
    q: string;
  };
  const navigation = useNavigation();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  return (
    <>
      <div className="w-full p-4">
        <div className="flex flex-col md:flex-row gap-4 max-w-screen-xl mx-auto">
          <div className="px-0 w-full md:w-3/12 lg:max-w-lg mx-auto md:min-w-72 flex flex-col gap-4">
            <Form
              id="search-form"
              role="search"
              className="border border-gray-200 bg-gray-50 rounded-lg flex justify-between items-center max-h-8"
            >
              <input
                id="q"
                className={`${searching ? "loading" : ""} p-2 text-sm flex-1 bg-transparent placeholder:text-gray-200 outline-none`}
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                defaultValue={q}
              />
            </Form>
            <a
              href="https://github.com/codecrafters-io/build-your-own-x"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                role="button"
                className="h-full flex flex-col justify-center gap-2 p-4 rounded-lg bg-gray-900 w-full shadow-sm"
              >
                <span className="text-lg text-blue-500 logo">
                  Learn better by building?
                </span>
                <span className="text-gray-100 text-sm">
                  Check out the{" "}
                  <span className="font-bold">Build Your Own X</span> repo.
                </span>
              </div>
            </a>
          </div>
          <div className="flex-1">
            <div className="w-full flex flex-col gap-5">
              <div className="shadow-sm flex flex-col gap-1 md:gap-0 md:flex-row w-full p-1 bg-gradient-to-r from-[#CF4B32] to-[#646EE4] rounded-lg">
                <div className="flex flex-col gap-3 lg:gap-6 text-gray-100 p-4 w-full md:w-[65%] bg-gradient-to-r from-[#763428] to-[#B74630] rounded-l-lg">
                  <h1 className="logo text-4xl">
                    Help others fail again, but fail better.
                  </h1>
                  <span>
                    Have a cool puzzle? Share it with the community! You know
                    what they say: Archiving is caring.
                  </span>
                </div>
                <Form
                  method="post"
                  id="puzzle-form"
                  className="w-full flex flex-col gap-4 bg-gradient-to-r from-gray-900 to-[#161C2A] rounded-r-lg p-4"
                >
                  <h1 className="logo text-xl">Create a Puzzle</h1>
                  <input
                    placeholder="Title"
                    type="text"
                    name="title"
                    className="max-h-8 border border-gray-200 rounded-lg p-2 text-sm flex-1 bg-transparent placeholder:text-gray-200 outline-none"
                  />
                  <textarea
                    placeholder="Description"
                    name="description"
                    className="border border-gray-200 rounded-lg p-2 text-sm flex-1 bg-transparent placeholder:text-gray-200 outline-none"
                    rows={5}
                  />
                  <input
                    placeholder="Expected Output"
                    type="text"
                    name="expected_output"
                    className="max-h-8 border border-gray-200 rounded-lg p-2 text-sm flex-1 bg-transparent placeholder:text-gray-200 outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn-md md:btn-sm btn btn-outline btn-warning"
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              </div>
              <span className="logo">{allPuzzData.length} puzzles found.</span>
              {allPuzzData.map((puzz) => {
                return (
                  <Link to={`/puzzles/${puzz.id}`} key={puzz.id}>
                    {" "}
                    {/* Key added here */}
                    <div className="flex flex-col gap-4 bg-gray-400 p-4 rounded-lg shadow-sm hover:bg-gradient-to-r from-gray-900 to-[#161C2A]">
                      <div>
                        <span className="text-lg text-red-500 logo">
                          {puzz.title}
                        </span>{" "}
                        <span className="hidden md:inline text-sm text-gray-200 pb-4">
                          by {puzz.creator.username}
                        </span>
                      </div>
                      <div className="flex flex-col lg:flex-row">
                        <div className="flex-1 flex flex-col items-start gap-4 pb-4">
                          <p className="text-gray-100 text-sm whitespace-pre-wrap">
                            {puzz.description}
                          </p>
                        </div>
                        <div className="divider divider-horizontal ml-1 mr-4"></div>
                        <div className="flex flex-col gap-2 min-w-[8rem] md:max-w-[8rem]">
                          <div className="flex justify-start flex-wrap gap-1">
                            {Object.entries(puzz.solutions_by_languages).map(
                              ([language, solutions]) => {
                                return (
                                  <div
                                    key={language} // Key added here for language entries
                                    className="tooltip"
                                    data-tip={`${solutions.length} ${solutions.length === 1 ? "solution" : "solutions"} in ${language}`}
                                  >
                                    <div className="py-1">
                                      <i
                                        className={`devicon-${language.toLowerCase() === "c++" ? "cplusplus" : language.toLowerCase()}-plain text-xl p-2 text-gray-100 bg-gray-900 rounded-lg`}
                                      ></i>
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
