interface Puzzle {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  creator_id: number;
  tags: string[];
  expected_output: string;
}

interface CompletedSolution {
  id: number;
  source_code: string;
  language_id: number;
  puzzle_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface Language {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  version: string;
}

interface UserStats {
  leaderboard_position: number;
  most_used_language: string | null;
}

interface Following {
  id: number;
  username: string;
  most_used_language: string;
}

interface Follower {
  id: number;
  username: string;
  most_used_language: string;
}

interface ActiveRelationship {
  id: number;
  follower_id: number;
  followed_id: number;
  created_at: Date;
  updated_at: Date;
}

interface CurrentUser {
  id: number;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  following: Following[];
  followers: Follower[];
  solutions: CompletedSolution[];
  solved_puzzles: Puzzle[];
  solutions_by_puzzle: Record<number, CompletedSolution[]>;
  solutions_by_language: Record<string, number>;
  languages: Language[];
  created_puzzles: Puzzle[];
  stats: UserStats;
  active_relationships: ActiveRelationship[];
}

export interface User {
  current_user: CurrentUser;
}

export interface OtherUser {
  id: number;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  following: Following[];
  followers: Follower[];
  solutions: CompletedSolution[];
  solved_puzzles: Puzzle[];
  solutions_by_puzzle: Record<number, CompletedSolution[]>;
  solutions_by_language: Record<string, number>;
  languages: Language[];
  created_puzzles: Puzzle[];
  stats: UserStats;
  active_relationships: ActiveRelationship[];
}
