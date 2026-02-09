import "./Day.css";

type DayProps = {
  weekday: string;
};

function Day(props: DayProps) {
  return (
    <div className="dayDiv">
      <div className="weekday">{props.weekday}</div>
      <div className="dayContent">somecontent</div>
    </div>
  );
}

export default Day;
