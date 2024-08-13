import {
  Form,
  Link,
  redirect,
  useLoaderData,
  useOutletContext,
} from "react-router-dom";
import { Puzzle } from "../types/puzzle";
import { useEffect, useState } from "react";
import { blo } from "blo";
import { User } from "../types/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCode,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import { toastError, toastSuccess } from "../utils/toasts";

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
    return redirect("/");
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

    if (response.ok) {
      toastSuccess("Puzzle solved!");
    } else {
      toastError(
        "Incorrect. Try again. Don't forget to log your output on the last line.",
      );
    }

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
  const { data } = useOutletContext() as { data: User };
  const { puzzle, solvedPuzzles, langData } = useLoaderData() as {
    puzzle: Puzzle;
    solvedPuzzles: Puzzle[];
    langData: Language[];
  };
  const [enableSolutions, setEnableSolutions] = useState(false);
  const [dataToDisplay, setDataToDisplay] = useState("Instructions");

  useEffect(() => {
    if (solvedPuzzles.some((solvedPuzzle) => solvedPuzzle.id === puzzle.id)) {
      setEnableSolutions(true);
    } else {
      setEnableSolutions(false);
    }
  }, [solvedPuzzles, puzzle.id]);

  return (
    <div className="overflow-clip w-full h-full pt-4 px-4 lg:px-9 flex flex-col md:flex-row md:justify-between">
      <div className="flex flex-col md:flex-row min-h-96 h-auto md:h-[calc(100vh-164px)] w-full gap-4">
        <div className="w-full md:w-5/12 sm:max-h-[75vh] md:max-h-screen h-auto md:h-full md:overflow-visible flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl logo text-red-500">{puzzle.title}</h1>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <FontAwesomeIcon
                  icon={faUserPen}
                  className="text-sm text-gray-200"
                />
                <span className="lg:block text-sm text-gray-200">
                  {" "}
                  {puzzle.creator.username}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-sm text-gray-200"
                />
                <span className="lg:block text-sm text-gray-200">
                  {" "}
                  {puzzle.solvers.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon
                  icon={faCode}
                  className="text-sm text-gray-200"
                />
                <span className="lg:block text-sm text-gray-200">
                  {" "}
                  {Object.keys(puzzle.solutions_by_languages).length}
                </span>
              </div>
            </div>
          </div>
          <ul className="flex items-center gap-1 bg-trasparent py-2 overflow-y-hidden overflow-x-auto text-sm logo">
            <li>
              <button
                className={`rounded-lg ${dataToDisplay === "Instructions" ? "bg-gray-400" : ""} px-3 py-2 whitespace-nowrap logo text-gray-100`}
                onClick={() => setDataToDisplay("Instructions")}
              >
                Instructions
              </button>
            </li>
            <li>
              <button
                className={`rounded-lg ${data.current_user.solved_puzzles.map((puzz) => puzz.id).includes(puzzle.id) ? "" : "hidden"} ${dataToDisplay === "Own Solutions" ? "bg-gray-400" : ""} px-3 py-2 whitespace-nowrap logo text-gray-100`}
                onClick={() => setDataToDisplay("Own Solutions")}
              >
                Own Solutions
              </button>
            </li>
            <li>
              <button
                className={`rounded-lg ${enableSolutions && puzzle.solvers.filter((solver) => solver.id !== data.current_user.id).length >= 1 ? "" : "hidden"} ${dataToDisplay === "Others' Solutions" ? "bg-gray-400" : ""} px-3 py-2 whitespace-nowrap logo text-gray-100`}
                onClick={() => setDataToDisplay("Others' Solutions")}
                disabled={!enableSolutions}
              >
                Others' Solutions
              </button>
            </li>
          </ul>
          <div className="p-4 bg-gray-400 max-h-[24rem] min-h-[24rem] md:max-h-full md:h-full rounded-lg shadow-sm whitespace-pre-wrap overflow-auto flex flex-col">
            {dataToDisplay === "Instructions" ? (
              <p className="text-gray-100 text-md h-full">
                {puzzle.description}
              </p>
            ) : dataToDisplay === "Others' Solutions" ? (
              Object.entries(puzzle.solutions_by_languages)
                .reverse()
                .map(([language, solutions]) => (
                  <div className="flex flex-col gap-4" key={language}>
                    {solutions
                      .filter(
                        (solution) => solution.user_id !== data.current_user.id,
                      )
                      .map((solution) => {
                        const solver = puzzle.solvers.find(
                          (solver) => solution.user_id === solver.id,
                        );
                        const userId = solver?.id;
                        const isCurrentUser = userId === data.current_user.id;

                        return (
                          <Link
                            to={
                              isCurrentUser ? "/dashboard/" : `/users/${userId}`
                            }
                            className={`flex flex-col gap-2 ${enableSolutions ? "" : "pointer-events-none"}`}
                            key={solution.id}
                          >
                            <div className="flex items-center gap-2 pb-2">
                              <img
                                src={blo(solver?.username as `0x${string}`)}
                                className="w-8 h-8 rounded-full"
                                role="button"
                                tabIndex={0}
                                alt={`${solver?.username}'s avatar`} // Add alt text for accessibility
                              />
                              <span className="text-lg logo">
                                {solver?.username}
                              </span>
                            </div>
                            <span className="text-sm text-gray-100">
                              {language}:
                            </span>
                            <code className="select-none text-xs whitespace-pre-wrap bg-gray-800 p-2 rounded-lg overflow-x-auto">
                              {solution.source_code}
                            </code>
                            <div className="flex items-center gap-2">
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
                          </Link>
                        );
                      })}
                  </div>
                ))
            ) : dataToDisplay === "Own Solutions" ? (
              Object.entries(puzzle.solutions_by_languages)
                .reverse()
                .map(([language, solutions]) => (
                  <div className="flex flex-col gap-4" key={language}>
                    {solutions
                      .filter(
                        (solution) => solution.user_id === data.current_user.id,
                      )
                      .map((solution) => {
                        const solver = puzzle.solvers.find(
                          (solver) => solution.user_id === solver.id,
                        );
                        const userId = solver?.id;
                        const isCurrentUser = userId === data.current_user.id;

                        return (
                          <Link
                            to={
                              isCurrentUser ? "/dashboard/" : `/users/${userId}`
                            }
                            className={`flex flex-col gap-2 ${enableSolutions ? "" : "pointer-events-none"}`}
                            key={solution.id}
                          >
                            <div className="flex items-center gap-2 pb-2">
                              <img
                                src={blo(solver?.username as `0x${string}`)}
                                className="w-8 h-8 rounded-full"
                                role="button"
                                tabIndex={0}
                                alt={`${solver?.username}'s avatar`} // Add alt text for accessibility
                              />
                              <span className="text-lg logo">
                                {solver?.username}
                              </span>
                            </div>
                            <span className="text-sm text-gray-100">
                              {language}:
                            </span>
                            <code className="select-none text-xs whitespace-pre-wrap bg-gray-800 p-2 rounded-lg overflow-x-auto">
                              {solution.source_code}
                            </code>
                            <div className="flex items-center gap-2">
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
                          </Link>
                        );
                      })}
                  </div>
                ))
            ) : null}
          </div>
          <a
            href="https://judge0.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="hidden md:flex h-full flex-col justify-center gap-2 p-4 rounded-lg bg-gray-900 w-full shadow-sm">
              <span className="text-lg text-blue-500 logo">
                Judge0 - Where code happens.
              </span>
              <p className="text-gray-100 text-sm">
                Judge0 is a robust, scalable, and open-source online code
                execution system that can be used to build a wide range of
                applications that need online code execution features.{" "}
              </p>
              <p className="text-gray-100 text-sm">
                It's the system that powers this app. Click to learn more.
              </p>
            </div>
          </a>
        </div>
        <div className="flex-1 w-full min-h-96 h-auto md:h-[calc(100vh-164px)]">
          <div className="md:max-h-screen h-auto md:h-full rounded-lg bg-gradient-to-l from-[#CF4B32] to-gray-800 p-1">
            <Form
              method="post"
              id="solution-form"
              className="w-full h-full flex flex-col gap-4 rounded-lg p-4 bg-gray-800"
            >
              <h1 className="logo text-xl text-gray-100">Your Attempt</h1>
              <input type="hidden" name="puzzle_id" defaultValue={puzzle.id} />
              <select
                name="language_id"
                className="max-h-9 border border-gray-200 rounded-lg p-2 text-sm bg-transparent text-gray-100 outline-none"
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
                  className="btn-sm btn btn-error btn-outline"
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
