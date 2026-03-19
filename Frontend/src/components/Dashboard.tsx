import "./Dashboard.css";

import { useEffect, useState } from "react";
import type { Goal } from "../data/data";
import WeekCalendar from "./WeekCalendar";
import ModalAddGoal from "./ModalAddGoal";

function Dashboard() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://goal-tracker.shop/goals", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched goals:", data);
        setGoals(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Failed to fetch goals:", err));
  }, []);

  return (
    <div className="dashboardDiv">
      <div className="dashboardGridDiv">
        <WeekCalendar
          modalOpenSetter={setModalOpen}
          allGoals={goals}
        ></WeekCalendar>
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
