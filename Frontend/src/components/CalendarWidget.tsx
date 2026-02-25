import "./CalendarWidget.css";
import Day from "./Day";
import { actions, goals } from "../data/data";
import type { Action, Goal } from "../data/data";

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
    map.set(g.ID, g);
  });

  return map;
}

interface CalendarWidgetProps {
  weekStart: Date;
  weekEnd: Date;
  onScrollBack: () => void;
  onScrollForward: () => void;
}

const weekDaysOrder = [1, 2, 3, 4, 5, 6, 0];
const weekDayLabels = ["M", "T", "W", "T", "F", "S", "S"];

function CalendarWidget({
  weekStart,
  weekEnd,
  onScrollBack,
  onScrollForward,
}: CalendarWidgetProps) {
  const weekActions = actions.filter((a) => {
    return a.date < weekEnd && a.date > weekStart;
  });
  const weekdaysMap = groupActionsByWeekday(weekActions);
  const goalsMap = createGoalsMap(goals);

  return (
    <div className="calendarWidget">
      <div className="calendarGrid">
        {weekDaysOrder.map((wd, index) => (
          <Day
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
