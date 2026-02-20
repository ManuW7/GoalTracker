import "./Dashboard.css";
import Day from "./Day";
import HotStreakWidget from "./HotStreakWidget";
import AddActions from "./AddActions";
import TopGoalsWidget from "./TopGoalsWidget";
import WeekProgressGraph from "./WeekProgressGraph";
import AddGoals from "./AddGoals";
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
      <div className="headersDiv">
        <h1>Your recent activity</h1>
        <h3>
          <button onClick={scrollWeekBack}>←</button>
          <p>{`${startOfTheCurrentWeek.toLocaleDateString("en-US", { month: "short" })} ${startOfTheCurrentWeek.getDate()} - ${endOfTheCurrentWeek.toLocaleDateString("en-US", { month: "short" })} ${endOfTheCurrentWeek.getDate()}`}</p>
          <button onClick={scrollWeekForward}>→</button>
        </h3>
      </div>
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
