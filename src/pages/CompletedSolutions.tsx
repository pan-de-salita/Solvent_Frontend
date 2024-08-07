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
      <div className="px-4 md:px-0 w-full mx-auto flex justify-center text-gray-100">
        <div className="bg-gray-400 rounded-lg md:mx-4 p-4 w-full max-w-5xl flex shadow-sm">
          <div className="w-[8rem] hidden md:flex flex-col gap-1">
            <h2 className="text-md">Quick facts</h2>
            <span className="text-sm">
              Solutions: {data.current_user.solutions.length}
            </span>
            <span className="text-sm">
              Puzzles: {data.current_user.solved_puzzles.length}
            </span>
          </div>
          <div className="divider divider-horizontal"></div>
          <div className="flex flex-col gap-12">
            {Object.entries(data.current_user.solutions_by_puzzle).map(
              ([puzzleId, solutions]) => {
                const puzzle = data.current_user.solved_puzzles.find(
                  (puz) => puz.id === Number(puzzleId),
                );

                return (
                  <div className="flex flex-col gap-4" key={puzzle?.id}>
                    <span className="text-lg text-red-500">
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
                        </div>
                      );
                    })}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    </>
  );
}
