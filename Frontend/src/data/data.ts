export type Goal = {
  id: number;
  name: string;
  description: string;
  color: string;
  date_set: Date;
  user_id: number;
};

export type Action = {
  id: number;
  name: string;
  goal_id: number;
  description: string;
  date: Date;
  user_id: number;
};
