import "./Dashboard.css";
import HotStreakWidget from "./HotStreakWidget";
import AddActions from "./AddActions";
import TopGoalsWidget from "./TopGoalsWidget";
import WeekProgressGraph from "./WeekProgressGraph";
import AddGoals from "./AddGoals";
import CalendarWidget from "./CalendarWidget";
import { useState } from "react";

function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentWeekDay = currentDate.getDay() || 7;
  const startOfTheCurrentWeek = new Date(currentDate);
  startOfTheCurrentWeek.setDate(currentDate.getDate() - (currentWeekDay - 1));
  const endOfTheCurrentWeek = new Date(currentDate);
  endOfTheCurrentWeek.setDate(currentDate.getDate() + 7 - currentWeekDay);

  function scrollWeekBack(): void {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 7);
      return newDate;
    });
  }

  function scrollWeekForward(): void {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 7);
      return newDate;
    });
  }

  return (
    <div className="dashboardDiv">
      <h1 className="dashboardTitle">Your recent activity</h1>
      <div className="dashboardGridDiv">
        <CalendarWidget
          weekStart={startOfTheCurrentWeek}
          weekEnd={endOfTheCurrentWeek}
          onScrollBack={scrollWeekBack}
          onScrollForward={scrollWeekForward}
        />
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
