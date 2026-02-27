import "./Day.css";
import type { Action, Goal } from "../data/data";

type DayProps = {
  weekday: string;
  actions: Action[];
  goalsMap: Map<number, Goal>;
};

function Day(props: DayProps) {
  return (
    <div className="dayDiv">
      <div className="weekday">{props.weekday}</div>
      <div className="dayContent">
        {props.actions.map((a, index) => (
          <div
            style={{ backgroundColor: props.goalsMap.get(a.goal_id)?.color }}
            className="calendarActionDiv"
            key={index}
          >
            ?
          </div>
        ))}
      </div>
    </div>
  );
}

export default Day;
