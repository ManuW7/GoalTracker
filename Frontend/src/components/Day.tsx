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
        {props.actions.map((a) => (
          <div
            style={{ backgroundColor: props.goalsMap.get(a.goalID)?.color }}
            className="calendarActionDiv"
          >
            ?
          </div>
        ))}
      </div>
    </div>
  );
}

export default Day;
