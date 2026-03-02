import "./Dashboard.css";
import HotStreakWidget from "./HotStreakWidget";
import AddActions from "./AddActions";
import TopGoalsWidget from "./TopGoalsWidget";
import WeekProgressGraph from "./WeekProgressGraph";
import AddGoals from "./AddGoals";
import CalendarWidget from "./CalendarWidget";
import { useEffect, useState } from "react";
import type { Goal, Action } from "../data/data";

function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentWeekDay = currentDate.getDay() || 7;
  const startOfTheCurrentWeek = new Date(currentDate);
  startOfTheCurrentWeek.setDate(currentDate.getDate() - (currentWeekDay - 1));
  const endOfTheCurrentWeek = new Date(currentDate);
  endOfTheCurrentWeek.setDate(currentDate.getDate() + 7 - currentWeekDay);

  const [goals, setGoals] = useState<Goal[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchGoals() {
      try {
        const response = await fetch(`http://83.136.235.118:8000/goals`);

        if (!response.ok) {
          throw new Error("NetworkError");
        }

        const data = await response.json();

        const parsed: Goal[] = data.map((g: any) => ({
          ...g,
          date_set: new Date(g.date_set),
        }));

        setGoals(parsed);
      } catch (err) {
        console.error(err);
        setGoals([]);
      }
    }

    fetchGoals();
  }, []);

  useEffect(() => {
    const fromDate = startOfTheCurrentWeek.toISOString();
    const toDate = endOfTheCurrentWeek.toISOString();
    
    async function fetchActions() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://83.136.235.118:8000/actions?start=${fromDate}&finish=${toDate}`,
        );

        if (!response.ok) {
          throw new Error("NetworkError");
        }

        const data = await response.json();

        const parsed: Action[] = data.map((a: any) => ({
          ...a,
          date: new Date(a.date),
        }));

        setActions(parsed);
      } catch (err) {
        console.error(err);
        setActions([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchActions();
  }, [currentDate]);

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
          goals={goals}
          actions={actions}
          isLoading={isLoading}
        />
        <TopGoalsWidget></TopGoalsWidget>
        <HotStreakWidget></HotStreakWidget>
        <WeekProgressGraph></WeekProgressGraph>
        <AddGoals setGoals={setGoals}></AddGoals>
        <AddActions goals={goals} setActions={setActions}></AddActions>
      </div>
    </div>
  );
}

export default Dashboard;
