import "./Dashboard.css";
import Day from "./Day";
import HotStreakWidget from "./HotStreakWidget";

function Dashboard() {
  return (
    <div className="dashboardDiv">
      <h1>Dashboard</h1>
      <h2>Your week</h2>
      <div className="calendarGrid">
        <Day weekday="Monday"></Day>
        <Day weekday="Tuesday"></Day>
        <Day weekday="Wednesday"></Day>
        <Day weekday="Thursday"></Day>
        <Day weekday="Friday"></Day>
        <Day weekday="Saturday"></Day>
        <Day weekday="Sunday"></Day>
      </div>
      <div className="widgetsDiv">
        <HotStreakWidget></HotStreakWidget>
      </div>
    </div>
  );
}

export default Dashboard;
