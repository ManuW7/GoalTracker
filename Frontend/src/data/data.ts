export type Goal = {
  id: number;
  name: string;
  color: string;

  date_set: Date;
  deadline: Date;

  everyday: boolean;

  target_count: number;
  current_count: number;

  streak: number;
  is_failed: boolean;
};

export type Action = {
  id: number;
  goal_id: number;

  name: string;
  description: string;

  date: Date;
};
