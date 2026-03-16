import { useEffect, useState } from "react";
import "./WeekCalendar.css";
import Day from "./Day.tsx";
import GoalNote from "./GoalNote.tsx";
import type { Goal } from "../data/data.ts";
import ModalAddGoal from "./ModalAddGoal.tsx";

function normalizeWeekDay(day: number) {
  if (day > 0) {
    return day - 1;
  }

  return 6;
}

function WeekCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentGoals, setCurrentGoals] = useState<Goal[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const currentweekDay = normalizeWeekDay(currentDate.getDay());
  const mondayDate = new Date(currentDate);
  mondayDate.setHours(0, 0, 0, 0);
  mondayDate.setDate(mondayDate.getDate() - currentweekDay);
  const sundayDate = new Date(currentDate);
  sundayDate.setHours(23, 59, 59, 59);
  sundayDate.setDate(sundayDate.getDate() + (6 - currentweekDay));

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

  function addNewGoal() {
    setModalOpen(true);
  }

  const week: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(mondayDate);
    date.setDate(date.getDate() + i);
    week.push(date);
  }

  useEffect(() => {
    fetch("http://83.136.235.118:8000/goals")
      .then((res) => res.json())
      .then((data) => setCurrentGoals(data));

    console.log(currentGoals);
  }, []);

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
        <GoalNote></GoalNote>
      </div>
      {modalOpen ? (
        <ModalAddGoal setIsModalOpen={setModalOpen}></ModalAddGoal>
      ) : null}
    </div>
  );
}

export default WeekCalendar;
