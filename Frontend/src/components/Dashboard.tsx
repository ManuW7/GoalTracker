import "./Dashboard.css";

import { useEffect, useState } from "react";
import type { Goal, Action } from "../data/data";
import WeekCalendar from "./WeekCalendar";
import ModalAddGoal from "./ModalAddGoal";

function Dashboard() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    fetch("http://83.136.235.118:8000/goals")
      .then((res) => res.json())
      .then((data) => setGoals(data));

    console.log(goals);
  }, []);

  useEffect(() => {
    console.log(goals);
  }, [goals]);

  return (
    <div className="dashboardDiv">
      <div className="dashboardGridDiv">
        <WeekCalendar modalOpenSetter={setModalOpen}></WeekCalendar>
      </div>
      {modalOpen ? (
        <ModalAddGoal
          setIsModalOpen={setModalOpen}
          setGoals={setGoals}
        ></ModalAddGoal>
      ) : null}
    </div>
  );
}

export default Dashboard;
