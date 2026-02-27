import "./CalendarWidget.css";
import Day from "./Day";
import type { Action, Goal } from "../data/data";
import { useEffect, useState } from "react";

function groupActionsByWeekday(actions: Action[]) {
  const map = new Map<number, Action[]>();

  actions.forEach((action) => {
    const day = action.date.getDay();

    if (!map.has(day)) {
      map.set(day, []);
    }

    map.get(day)!.push(action);
  });

  map.forEach((list) => list.splice(3));

  return map;
}

function createGoalsMap(goals: Goal[]) {
  const map = new Map<number, Goal>();

  goals.forEach((g) => {
    map.set(g.id, g);
  });

  return map;
}

interface CalendarWidgetProps {
  weekStart: Date;
  weekEnd: Date;
  goals: Goal[];
  onScrollBack: () => void;
  onScrollForward: () => void;
}

const weekDaysOrder = [1, 2, 3, 4, 5, 6, 0];
const weekDayLabels = ["M", "T", "W", "T", "F", "S", "S"];

function CalendarWidget({
  weekStart,
  weekEnd,
  goals,
  onScrollBack,
  onScrollForward,
}: CalendarWidgetProps) {
  const [actions, setActions] = useState<Action[]>([]);

  useEffect(() => {
    const fromDate = weekStart.toISOString();
    const toDate = weekEnd.toISOString();
    async function fetchActions() {
      try {
        const response = await fetch(
          `http://83.136.235.118:8000/actions?start=${fromDate}&finish=${toDate}`,
        );

        if (!response.ok) {
          throw new Error("NetworkError");
        }

        const data = await response.json();

        const parsed: Action[] = data.map((a: any) => ({
          ...a,
          date: new Date(a.date),
        }));

        setActions(parsed);
      } catch (err) {
        console.error(err);
        setActions([]);
      }
    }
    fetchActions();
  }, [weekStart, weekEnd]);

  const weekdaysMap = groupActionsByWeekday(actions);
  const goalsMap = createGoalsMap(goals);

  return (
    <div className="calendarWidget">
      <div className="calendarGrid">
        {weekDaysOrder.map((wd, index) => (
          <Day
            key={index}
            weekday={weekDayLabels[index]}
            actions={weekdaysMap.get(wd) ?? []}
            goalsMap={goalsMap}
          ></Day>
        ))}
      </div>
      <div className="weekControls">
        <button onClick={onScrollBack}>←</button>
        <p>{`${weekStart.toLocaleDateString("en-US", { month: "short" })} ${weekStart.getDate()} - ${weekEnd.toLocaleDateString("en-US", { month: "short" })} ${weekEnd.getDate()}`}</p>
        <button onClick={onScrollForward}>→</button>
      </div>
    </div>
  );
}

export default CalendarWidget;
