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
    return data.data.current_user_created_puzzles.reverse();
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

  const puzzData = await getCreatedPuzzles(JSON.parse(authToken));
  return { puzzData };
}

export default function CreatedPuzzles() {
  const { puzzData } = useLoaderData() as { puzzData: Puzzle[] };

  return (
    <>
      <div className="md:min-h-[29rem] px-4 md:px-0 w-full mx-auto flex justify-center text-gray-100">
        <div className="bg-gray-400 rounded-lg md:mx-4 p-4 w-full max-w-5xl flex shadow-sm">
          <div className="min-w-[10rem] hidden md:flex flex-col gap-1">
            <h2 className="text-lg logo">Quick facts</h2>
            <span className="text-sm">
              Languages Used:{" "}
              {
                puzzData
                  .map((puzz) => puzz.solutions_by_languages)
                  .map((solByLang) => Object.keys(solByLang))
                  .flat().length
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
            {puzzData.length === 0 && (
              <span className="text-gray-100 text-sm">No data to show.</span>
            )}{" "}
            {puzzData.map((puzz) => {
              return (
                <div className="flex flex-col gap-4" key={puzz.id}>
                  <div>
                    <span className="text-lg text-red-500 logo">
                      {puzz.title}
                    </span>{" "}
                    <span className="text-sm text-gray-200 pb-4">
                      {new Date(puzz.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:min-w-[40rem] flex flex-col items-start gap-4 pb-4">
                      <span className="text-gray-100 text-sm whitespace-pre-wrap">
                        {puzz.description}
                      </span>
                      <label className="swap py-2">
                        <input type="checkbox" />
                        <div className="swap-off btn btn-xs btn-outline">
                          REVEAL ANSWER
                        </div>
                        <div className="swap-on text-sm text-success">
                          {puzz.expected_output}
                        </div>
                      </label>
                    </div>
                    <div className="divider divider-horizontal ml-1 mr-2"></div>
                    <div className="lg:min-w-26 flex flex-col gap-2 min-w-[8rem]">
                      <div className="lg:min-w-26 flex justify-start flex-wrap gap-1">
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
                                    className={`devicon-${language.toLowerCase() === "c++" ? "cplusplus" : language.toLowerCase()}-plain text-gray-100 text-xl p-2 bg-gray-900 rounded-lg`}
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
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
