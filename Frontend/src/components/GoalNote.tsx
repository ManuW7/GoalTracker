import { useEffect, useMemo, useState } from "react";
import type { Action, Goal } from "../data/data";
import GoalCheckbox from "./GoalCheckbox";
import "./GoalNote.css";

interface GoalNoteProps {
  goal: Goal;
  weekStart: Date;
  weekEnd: Date;
}

function formatDate(date: Date): string {
  return date.toISOString();
}

function getDaysArray(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

function GoalNote({ goal, weekStart, weekEnd }: GoalNoteProps) {
  const [weekActions, setWeekActions] = useState<Action[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const startStr = formatDate(weekStart);
    const finishStr = formatDate(weekEnd);
    const url = `https://goal-tracker.shop/actions?start=${startStr}&finish=${finishStr}&goal_id=${goal.id}`;

    fetch(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setWeekActions(data);
      });
  }, [weekStart, weekEnd, goal.id]);

  const days = useMemo(
    () => getDaysArray(weekStart, weekEnd),
    [weekStart, weekEnd],
  );

  const actionsByDate = useMemo(() => {
    const actionsMap = new Map<string, Action[]>();

    weekActions.forEach((a) => {
      const date = formatDate(new Date(a.date));
      const existing = actionsMap.get(date) || [];
      actionsMap.set(date, [...existing, a]);
    });

    return actionsMap;
  }, [weekActions]);

  const goalDateSetTime = new Date(goal.date_set).setHours(0, 0, 0, 0);
  const goalDeadlineTime = goal.deadline
    ? new Date(goal.deadline).setHours(0, 0, 0, 0)
    : null;

  return (
    <div className="goalNote">
      <div className="infoHeader">
        <div className="goalNameWrapper">
          <div
            className="goalColor"
            style={{ backgroundColor: goal.color }}
          ></div>
          <p className="goalName">{goal.name}</p>
        </div>
        <div className="goalStat">{`6/7`}</div>
      </div>
      <div className="weekActionsDiv">
        {days.map((day) => {
          const dateStr = formatDate(day);
          const dayActions = actionsByDate.get(dateStr) || [];
          const dayTime = day.setHours(0, 0, 0, 0);

          return (
            <GoalCheckbox
              key={dateStr}
              actions={dayActions}
              setWeekActions={setWeekActions}
              goalID={goal.id}
              date={day}
              isActive={
                (goalDeadlineTime === null || goalDeadlineTime >= dayTime) &&
                goalDateSetTime <= dayTime
              }
            />
          );
        })}
      </div>
    </div>
  );
}

export default GoalNote;
