import { useMemo, useState } from "react";
import "./WeekCalendar.css";
import Day from "./Day.tsx";
import GoalNote from "./GoalNote.tsx";
import type { Goal } from "../data/data.ts";

interface weekCalendarProps {
  modalOpenSetter: React.Dispatch<React.SetStateAction<boolean>>;
  allGoals: Goal[];
}

function normalizeWeekDay(day: number) {
  if (day > 0) {
    return day - 1;
  }

  return 6;
}

function WeekCalendar({ modalOpenSetter, allGoals }: weekCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const { mondayDate, sundayDate } = useMemo(() => {
    const currentweekDay = normalizeWeekDay(currentDate.getDay());
    const monday = new Date(currentDate);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - currentweekDay);
    const sunday = new Date(currentDate);
    sunday.setHours(23, 59, 59, 59);
    sunday.setDate(sunday.getDate() + (6 - currentweekDay));
    return { mondayDate: monday, sundayDate: sunday };
  }, [currentDate]);

  const mondayMonth = mondayDate.getMonth();
  const sundayMonth = sundayDate.getMonth();
  const mondayYear = mondayDate.getFullYear();
  const sundayYear = sundayDate.getFullYear();

  const firstMonth = mondayDate.toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  });

  const headerLines =
    mondayMonth === sundayMonth && mondayYear === sundayYear
      ? [firstMonth]
      : [
          firstMonth,
          sundayDate.toLocaleDateString("ru-RU", {
            month: "long",
            year: "numeric",
          }),
        ];

  function scrollWeekBack() {
    const weekBack = new Date(currentDate);
    weekBack.setDate(weekBack.getDate() - 7);
    setCurrentDate(weekBack);
  }

  function scrollWeekForward() {
    const weekForward = new Date(currentDate);
    weekForward.setDate(weekForward.getDate() + 7);
    setCurrentDate(weekForward);
  }

  const currentGoals = useMemo(() => {
    const mondayTime = mondayDate.getTime();
    const sundayTime = sundayDate.getTime();

    return allGoals.filter((goal) => {
      const goalStart = new Date(goal.date_set).getTime();
      const goalEnd = goal.deadline
        ? new Date(goal.deadline).getTime()
        : Infinity;

      return goalStart <= sundayTime && goalEnd >= mondayTime;
    });
  }, [allGoals, mondayDate, sundayDate]);

  function addNewGoal() {
    modalOpenSetter(true);
  }

  const week: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(mondayDate);
    date.setDate(date.getDate() + i);
    week.push(date);
  }

  return (
    <div className="weekCalendarDiv">
      <div className="controls">
        <div className="monthYearContainer">
          {headerLines.map((line, index) => (
            <h3
              key={index}
              className={index === 0 ? "firstMonth" : "secondMonth"}
            >
              {line}
            </h3>
          ))}
        </div>
        <button className="addGoalButton" onClick={addNewGoal}>
          +
        </button>
        <div className="arrowButtonsDiv">
          <button onClick={scrollWeekBack}>
            <img src="./src/assets/arrow-left.png" alt="" />
          </button>
          <button onClick={scrollWeekForward}>
            <img src="./src/assets/arrow-right.png" alt="" />
          </button>
        </div>
      </div>

      <div className="weekDisplayDiv">
        {week.map((d, index) => (
          <Day day={d} key={index}></Day>
        ))}
      </div>
      <hr />

      <div className="goalsConainer">
        {Array.isArray(currentGoals) &&
          currentGoals.map((g) => (
            <GoalNote
              goal={g}
              key={g.id}
              weekEnd={sundayDate}
              weekStart={mondayDate}
            ></GoalNote>
          ))}
      </div>
    </div>
  );
}

export default WeekCalendar;
