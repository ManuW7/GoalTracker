import "./CalendarWidget.css";
import Day from "./Day";

interface CalendarWidgetProps {
  weekStart: Date;
  weekEnd: Date;
  onScrollBack: () => void;
  onScrollForward: () => void;
}

function CalendarWidget({ weekStart, weekEnd, onScrollBack, onScrollForward }: CalendarWidgetProps) {
  return (
    <div className="calendarWidget">
      <div className="calendarGrid">
        <Day weekday="M"></Day>
        <Day weekday="T"></Day>
        <Day weekday="W"></Day>
        <Day weekday="T"></Day>
        <Day weekday="F"></Day>
        <Day weekday="S"></Day>
        <Day weekday="S"></Day>
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
