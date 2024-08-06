type SolvedPuzzle = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  creator_id: number;
  tags: string[];
  expected_output: string;
};

type CompletedSolution = {
  id: number;
  source_code: string;
  language_id: number;
  puzzle_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
};

type Language = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  version: string;
};

type UserStats = {
  leaderboard_position: number;
  most_used_language: string | null;
};

type CurrentUser = {
  id: number;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  following: number[];
  followers: number[];
  solved_puzzles: SolvedPuzzle[];
  completed_solutions: Record<string, CompletedSolution[]>;
  languages: Language[];
  created_puzzles: SolvedPuzzle[];
  stats: UserStats;
};

export interface User {
  current_user: CurrentUser;
}