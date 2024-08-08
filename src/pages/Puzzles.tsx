import { Form, Link, useLoaderData, useNavigation } from "react-router-dom";
import { allPuzzle } from "../types/allPuzz";

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

    const filteredPuzzles = allPuzzles.filter((puzzle: allPuzzle) =>
      (
        puzzle.title.toLowerCase() +
        puzzle.tags.reduce((acc, curr) => acc + " " + curr, "")
      ).includes(q),
    );

    console.log(filteredPuzzles);

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

export default function Puzzles() {
  const { allPuzzData, q } = useLoaderData() as {
    allPuzzData: allPuzzle[];
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
              className="border border-gray-200 bg-gray-50 rounded-lg flex justify-between items-center max-h-7"
            >
              <input
                id="q"
                className={`${searching ? "loading" : ""} px-2 py-1 text-sm flex-1 bg-transparent placeholder:text-gray-200 outline-none`}
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
            >
              <div
                role="button"
                className="h-full flex flex-col justify-center gap-2 p-4 rounded-lg bg-gray-900 w-full"
              >
                <span className="text-lg text-blue-500 logo">
                  Learn better by building?
                </span>
                <span className="text-sm">
                  Check out the{" "}
                  <span className="font-bold">Build Your Own X</span> repo.
                </span>
              </div>
            </a>
          </div>
          <div className="flex-1">
            <div className="w-full flex flex-col gap-5">
              <span className="logo">{allPuzzData.length} puzzles found.</span>
              {allPuzzData.map((puzz) => {
                return (
                  <Link to={`puzzles/${puzz.id}`}>
                    <div
                      className="flex flex-col gap-4 bg-gray-400 p-4 rounded-lg"
                      key={puzz.id}
                    >
                      <div>
                        <span className="text-lg text-red-500 logo">
                          {puzz.title}
                        </span>{" "}
                        <span className="text-sm text-gray-200 pb-4">
                          {new Date(puzz.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                            },
                          )}
                        </span>
                      </div>

                      <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-full lg:max-w-3xl flex flex-col items-start gap-4 pb-4">
                          <span className="text-sm">{puzz.description}</span>
                        </div>
                        <div className="divider divider-horizontal ml-0 "></div>
                        <div className="lg:min-w-26 flex flex-col gap-1 min-w-[8rem]">
                          <div className="flex justify-start flex-wrap gap-1">
                            {Object.entries(puzz.solutions_by_languages).map(
                              ([language, solutions]) => {
                                return (
                                  <div
                                    key={language}
                                    className="tooltip"
                                    data-tip={`${solutions.length} ${solutions.length === 1 ? "solution" : "solutions"} in ${language}`}
                                  >
                                    <div className="py-1">
                                      <i
                                        className={`devicon-${language.toLowerCase()}-plain text-lg p-2 bg-gray-900 rounded-lg`}
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
