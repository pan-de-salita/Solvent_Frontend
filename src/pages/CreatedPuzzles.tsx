import { redirect } from "react-router-dom";
import { useLoaderData } from "react-router-typesafe";
import { Puzzle } from "../types/puzzle";

async function getCreatedPuzzles(authToken: string) {
  try {
    const response = await fetch(
      "https://solvent-nfkw.onrender.com/api/v1/current_user/created_puzzles",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      },
    );

    const data = await response.json();
    return data.data.current_user_created_puzzles;
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

  const puzzData = await getCreatedPuzzles(JSON.parse(authToken));
  return { puzzData };
}

export default function CreatedPuzzles() {
  const { puzzData } = useLoaderData() as { puzzData: Puzzle[] };

  return (
    <>
      <div className="px-4 md:px-0 w-full mx-auto flex justify-center text-gray-100">
        <div className="bg-gray-400 rounded-lg md:mx-4 p-4 w-full max-w-5xl flex shadow-sm">
          <div className="min-w-[10rem] hidden md:flex flex-col gap-1">
            <h2 className="text-lg logo">Quick facts</h2>
            <span className="text-sm">
              Languages Used:{" "}
              {
                puzzData
                  .map((puzz) => puzz.solutions_by_languages)
                  .flat()
                  .map((solByLang) => Object.keys(solByLang)).length
              }
            </span>
            <span className="text-sm">
              Submitted Solutions:{" "}
              {puzzData
                .map((puzz) => puzz.solutions_by_languages)
                .reduce((count, solByLang) => {
                  return (
                    count +
                    Object.values(solByLang).reduce((acc, curr) => {
                      return acc + curr.length;
                    }, 0)
                  );
                }, 0)}
            </span>
          </div>
          <div className="divider divider-horizontal"></div>
          <div className="w-full flex flex-col gap-6">
            {puzzData.map((puzz) => {
              return (
                <div className="flex flex-col gap-4" key={puzz.id}>
                  <span className="text-lg text-red-500 logo">
                    {puzz.title}
                  </span>
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-[40rem] flex flex-col items-start gap-4 pb-4">
                      <span className="text-sm">{puzz.description}</span>

                      <label className="swap pb-2">
                        <input type="checkbox" />
                        <div className="swap-off btn btn-xs btn-outline">
                          REVEAL ANSWER
                        </div>
                        <div className="swap-on text-sm text-success">
                          {puzz.expected_output}
                        </div>
                      </label>
                    </div>
                    <div className="divider divider-horizontal"></div>
                    {Object.entries(puzz.solutions_by_languages).length ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-start flex-wrap gap-1">
                          {Object.entries(puzz.solutions_by_languages).map(
                            ([language, solutions]) => {
                              return (
                                <div
                                  key={language}
                                  className="tooltip"
                                  data-tip={`${solutions.length} ${solutions.length === 1 ? "solution" : "solutions"} in ${language}`}
                                >
                                  <i
                                    className={`devicon-${language.toLowerCase()}-plain text-md p-2 bg-gray-900 rounded-lg`}
                                  ></i>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
