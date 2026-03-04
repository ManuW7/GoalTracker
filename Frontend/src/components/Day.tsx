import "./Day.css";

interface dayProps {
  day: Date;
}

const weekDays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

function Day(props: dayProps) {
  return (
    <div className="dayDiv">
      <p className="weekday">{weekDays[props.day.getDay()]}</p>
      <p className="date">
        {props.day.getDate().toLocaleString("ru", { minimumIntegerDigits: 2 })}
      </p>
    </div>
  );
}

export default Day;
