import "./Dashboard.css";
import Day from "./Day";
import HotStreakWidget from "./HotStreakWidget";
import AddActions from "./AddActions";
import TopGoalsWidget from "./TopGoalsWidget";
import WeekProgressGraph from "./WeekProgressGraph";
import AddGoals from "./AddGoals";

function Dashboard() {
  return (
    <div className="dashboardDiv">
      <h1>Your recent activity</h1>
      <div className="dashboardGridDiv">
        <div className="calendarGrid">
          <Day weekday="M"></Day>
          <Day weekday="T"></Day>
          <Day weekday="W"></Day>
          <Day weekday="T"></Day>
          <Day weekday="F"></Day>
          <Day weekday="S"></Day>
          <Day weekday="S"></Day>
        </div>
        <TopGoalsWidget></TopGoalsWidget>
        <HotStreakWidget></HotStreakWidget>
        <WeekProgressGraph></WeekProgressGraph>
        <AddGoals></AddGoals>
        <AddActions></AddActions>
      </div>
    </div>
  );
}

export default Dashboard;
