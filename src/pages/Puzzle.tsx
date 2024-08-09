import { Form, redirect, useLoaderData } from "react-router-dom";
import { Puzzle } from "../types/puzzle";
import { useEffect, useState } from "react";

interface Language {
  id: number;
  name: string;
  version: string | null;
}

async function getPuzzle(puzzleId: number, authToken: string) {
  try {
    const response = await fetch(
      `https://solvent-nfkw.onrender.com/api/v1/puzzles/${puzzleId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      },
    );

    const data = await response.json();
    return data.data.puzzle;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getSolvedPuzzles(authToken: string) {
  try {
    const response = await fetch(
      `https://solvent-nfkw.onrender.com/api/v1/current_user/solved_puzzles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      },
    );

    const data = await response.json();
    return data.data.current_user_solved_puzzles;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getLanguages() {
  try {
    const response = await fetch(
      "https://solvent-nfkw.onrender.com/api/v1/languages",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return data.data.languages;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function loader({ params }: { params: any }) {
  const authToken = localStorage.getItem("Authorization");

  if (!authToken) {
    return redirect("/login");
  }

  const solvedPuzzles = await getSolvedPuzzles(JSON.parse(authToken));

  const puzzle = await getPuzzle(
    JSON.parse(params.puzzleId),
    JSON.parse(authToken),
  );

  const langData = await getLanguages();

  return { puzzle, solvedPuzzles, langData };
}

async function createSolution(
  newSolution: {
    puzzle_id: number;
    language_id: number;
    source_code: string;
  },
  authToken: string,
) {
  try {
    const response = await fetch(
      `https://solvent-nfkw.onrender.com/api/v1/puzzles/${newSolution.puzzle_id}/solutions`,
      {
        method: "POST",
        body: JSON.stringify({ solution: newSolution }),
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
  const newSolution = Object.fromEntries(formData) as {
    puzzle_id: string;
    language_id: string;
    source_code: string;
  };
  const formattedSolution = {
    puzzle_id: Number(newSolution.puzzle_id),
    language_id: Number(newSolution.language_id),
    source_code: newSolution.source_code,
  };
  const authToken = localStorage.getItem("Authorization");

  if (authToken) {
    await createSolution(formattedSolution, JSON.parse(authToken));
  }

  return redirect(`/puzzles/${formattedSolution.puzzle_id}`);
}

export default function SolvePuzzle() {
  const { puzzle, solvedPuzzles, langData } = useLoaderData() as {
    puzzle: Puzzle;
    solvedPuzzles: Puzzle[];
    langData: Language[];
  };
  const [enableSolutions, setEnableSolutions] = useState(false);

  useEffect(() => {
    console.log(solvedPuzzles);
    if (
      solvedPuzzles.filter((solvedPuzzle) => solvedPuzzle.id === puzzle.id)
        .length
    ) {
      setEnableSolutions(true);
    }
  }, []);

  return (
    <div className="overflow-clip w-full h-full p-4 lg:px-9 flex flex-col md:flex-row md:justify-between">
      <div className="flex flex-col md:flex-row min-h-96 h-auto md:h-[calc(100vh-164px)] w-full gap-4">
        <div className="w-full md:w-5/12 max-h-[75vh] md:max-h-screen h-auto md:h-full md:overflow-visible flex flex-col gap-4">
          <div className="flex items-center gap-2 md:pt-4">
            <h1 className="text-xl logo text-red-500">{puzzle.title}</h1>
            <span className="hidden lg:block text-md text-gray-200">
              by {puzzle.creator.username}
            </span>
          </div>
          <div className="bg-gray-400 h-full rounded-lg shadow-sm">
            <div className="bg-gray-800 h-8 rounded-t-lg flex items-center px-4">
              <span className="text-gray-100 text-sm font-bold">
                Instructions
              </span>
            </div>
            <p className="text-gray-100 max-h-[25.75rem] p-4 text-sm whitespace-pre-wrap overflow-auto">
              {puzzle.description}
            </p>
          </div>
          <div className="w-full relative bg-gray-400 h-full rounded-lg shadow-sm ">
            <div className="bg-gray-800 h-8 rounded-t-lg flex items-center px-4 w-full gap-2">
              <span
                className={`${enableSolutions || !Object.entries(puzzle.solutions_by_languages).length ? "text-gray-100" : "text-red-500"} text-sm font-bold`}
              >
                {enableSolutions ||
                !Object.entries(puzzle.solutions_by_languages).length
                  ? "Solutions"
                  : "Solve the puzzle to unlock others' solutions"}
              </span>
            </div>
            <div
              className={`text-gray-100 ${Object.entries(puzzle.solutions_by_languages).length ? "h-[25.75rem]" : ""} ${enableSolutions ? "" : "blur-sm"} px-4 pt-4 text-sm whitespace-pre-wrap overflow-auto`}
            >
              {Object.entries(puzzle.solutions_by_languages)
                .reverse()
                .map(([language, solutions]) => {
                  return (
                    <div className="flex flex-col gap-4" key={language}>
                      {solutions.map((solution) => {
                        return (
                          <div
                            className="flex flex-col gap-2"
                            key={solution.id}
                          >
                            <span className="text-sm">{language}:</span>
                            <code className="text-xs whitespace-pre-wrap bg-gray-800 p-2 rounded-lg overflow-x-auto">
                              {solution.source_code}
                            </code>
                            <div className="flex items-center gap-2">
                              {
                                // Add user link here
                              }
                              <span className="text-sm text-gray-200">
                                {new Date(
                                  solution.created_at,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                })}
                              </span>
                            </div>
                            <div className="divider"></div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="flex-1 w-full min-h-96 h-auto md:h-[calc(100vh-164px)]">
          <div className="max-h-[75vh] md:max-h-screen h-auto md:h-full rounded-lg bg-gradient-to-l from-[#CF4B32] to-gray-800 p-1">
            <Form
              method="post"
              id="solution-form"
              className="w-full h-full flex flex-col gap-4 rounded-lg p-4 bg-gray-800"
            >
              <h1 className="logo text-xl">Your Attempt</h1>
              <input type="hidden" name="puzzle_id" defaultValue={puzzle.id} />
              <select
                name="language_id"
                className="max-h-9 border border-gray-200 rounded-lg p-2 text-sm bg-transparent outline-none"
              >
                {langData.map((language) => (
                  <option key={language.id} value={language.id}>
                    {language.name}{" "}
                    {language.version ? `(${language.version})` : ""}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="// Your code here."
                name="source_code"
                className="code border border-gray-200 rounded-lg p-2 text-sm flex-1 bg-transparent placeholder:text-gray-200 outline-none"
                rows={20}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-md md:btn-sm btn btn-error"
                >
                  Submit
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
