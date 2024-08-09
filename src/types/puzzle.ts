interface MiniUser {
  id: number;
  username: string;
  email: string;
}

interface Solution {
  id: number;
  source_code: string;
  language_id: number;
  puzzle_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface SolutionsByLanguage {
  [language: string]: Solution[];
}

interface Stats {
  solvers: number;
  solutions: number;
  languages: {
    [language: string]: number;
  };
}

export interface Puzzle {
  id: number;
  title: string;
  description: string;
  expected_output: string;
  creator: MiniUser;
  tags: string[];
  created_at: string;
  updated_at: string;
  solutions_by_languages: SolutionsByLanguage;
  stats: Stats;
  solvers: MiniUser[];
}
