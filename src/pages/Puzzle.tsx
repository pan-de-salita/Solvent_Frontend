import { redirect, useLoaderData } from "react-router-dom";
import { Puzzle } from "../types/puzzle";

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

export async function loader({ params }: { params: any }) {
  const authToken = localStorage.getItem("Authorization");

  if (!authToken) {
    return redirect("/login");
  }

  const puzzle = await getPuzzle(
    JSON.parse(params.puzzleId),
    JSON.parse(authToken),
  );
  return { puzzle };
}

export default function SolvePuzzle() {
  const { puzzle } = useLoaderData() as { puzzle: Puzzle };
  return <div>{JSON.stringify(puzzle)}</div>;
}
