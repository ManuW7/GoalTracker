import "./Day.css";

type DayProps = {
  weekday: string;
};

function Day(props: DayProps) {
  return (
    <div className="dayDiv">
      <div className="weekday">{props.weekday}</div>
      <div className="dayContent">
        <div className="actionItem">🎸</div>
      </div>
    </div>
  );
}

export default Day;
