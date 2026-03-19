import { act, useState } from "react";
import type { Action } from "../data/data";
import "./ModalAddActions.css";
import { Form } from "react-router-dom";

interface ModalAddActionsProps {
  actions: Action[];
  goalId: number;
  setWeekActions: React.Dispatch<React.SetStateAction<Action[]>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  day: Date;
}

function ModalAddActions({
  actions,
  goalId,
  setWeekActions,
  setIsModalOpen,
  day,
}: ModalAddActionsProps) {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [newActionName, setNewActionName] = useState<string>("");
  const [newActionDescription, setNewActionDescription] = useState<string>("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const token = localStorage.getItem("token");

    const dayTime = day.getTime();
    if (isNaN(dayTime)) {
      console.error("Invalid date:", day);
      return;
    }

    interface Payload {
      goal_id: number;
      name: string;
      description: string;
      date: string;
    }

    const payload: Payload = {
      goal_id: goalId,
      name: formData.get("actionName") as string,
      description: formData.get("actionDescription") as string,
      date: day.toISOString(),
    };

    console.log("Отправляемый JSON:", JSON.stringify(payload, null, 2));

    fetch("https://goal-tracker.shop/actions", {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Ошибка сервера:");
          console.error("Status:", res.status);
          console.error("Response:", errorData);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((action) => {
        console.log("Created action:", action);
        setWeekActions((prevActions) => [...prevActions, action]);
        setIsFormOpen(false);
        setIsModalOpen(false);
      })
      .catch((err) => console.error("Failed to create action:", err));
  }

  return (
    <div className="modalOutline">
      <div className="modalContent">
        <div className="modalGoalsHeader">
          <h2>Действия</h2>
          <button onClick={() => setIsModalOpen(false)}>
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.41406 1.41421L23.9141 23.9142"
                stroke="black"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M23.9141 1.41421L1.41406 23.9142"
                stroke="black"
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="actionsContainer">
          {actions.map((a) => (
            <div className="completedAction">{a.name}</div>
          ))}
          {!isFormOpen ? (
            <button
              className="createActionButton"
              onClick={() => setIsFormOpen(true)}
            >
              +
            </button>
          ) : (
            <form onSubmit={(e) => handleSubmit(e)}>
              <label htmlFor="actionName">
                <p>Что сделали?</p>
                <input
                  type="text"
                  required
                  value={newActionName}
                  name="actionName"
                  id="actionName"
                  onChange={(e) => setNewActionName(e.target.value)}
                />
              </label>
              <label htmlFor="actionDescription">
                <p>Как сделали?</p>
                <input
                  type="text"
                  required
                  value={newActionDescription}
                  name="actionDescription"
                  id="actionDescription"
                  onChange={(e) => setNewActionDescription(e.target.value)}
                />
              </label>
              <button type="submit">Добавить действие</button>
              <button className="cancel" onClick={() => setIsFormOpen(false)}>
                Отмена
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalAddActions;
