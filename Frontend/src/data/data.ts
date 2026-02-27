export type Goal = {
  id: number;
  name: string;
  description: string;
  color: string;
  dateSet: Date;
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
