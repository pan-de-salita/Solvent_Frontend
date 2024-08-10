import { useOutletContext } from "react-router-dom";
import { User } from "../types/user";
import { useLoaderData } from "react-router-typesafe";

interface Language {
  id: number;
  name: string;
  version: string | null;
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

export async function loader() {
  const langData = await getLanguages();
  return { langData };
}

export default function CompletedSolutions() {
  const { data } = useOutletContext() as { data: User };
  const { langData } = useLoaderData() as { langData: Language[] };

  return (
    <>
      <div className="md:min-h-[29rem] px-4 md:px-0 w-full mx-auto flex justify-center text-gray-100">
        <div className="bg-gray-400 rounded-lg md:mx-4 p-4 w-full max-w-5xl flex shadow-sm">
          <div className="min-w-[10rem] hidden md:flex flex-col gap-1">
            <h2 className="text-lg logo">Quick facts</h2>
            <span className="text-sm">
              Completed Solutions: {data.current_user.solutions.length}
            </span>
            <span className="text-sm">
              Solved Puzzles: {data.current_user.solved_puzzles.length}
            </span>
          </div>
          <div className="divider divider-horizontal"></div>
          <div className="w-full flex flex-col gap-6">
            {Object.entries(data.current_user.solutions_by_puzzle).length ===
              0 && (
              <span className="text-gray-100 text-sm">No data to show.</span>
            )}{" "}
            {Object.entries(data.current_user.solutions_by_puzzle)
              .reverse()
              .map(([puzzleId, solutions]) => {
                const puzzle = data.current_user.solved_puzzles.find(
                  (puz) => puz.id === Number(puzzleId),
                );

                return (
                  <div className="flex flex-col gap-4" key={puzzle?.id}>
                    <span className="text-lg logo text-red-500">
                      {puzzle?.title ?? "Unknown Puzzle"}
                    </span>
                    {solutions.map((solution) => {
                      const language = langData.find(
                        (lang) => lang.id === solution.language_id,
                      );

                      return (
                        <div className="flex flex-col gap-2" key={solution.id}>
                          <span className="text-sm">
                            {language?.name ?? "Unknown Language"}:
                          </span>
                          <code className="text-xs whitespace-pre-wrap bg-gray-800 p-2 rounded-lg overflow-x-auto">
                            {solution.source_code}
                          </code>
                          <span className="text-sm text-gray-200 pb-3">
                            {new Date(solution.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                              },
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
