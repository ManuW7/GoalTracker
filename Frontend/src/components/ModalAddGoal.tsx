import { useState } from "react";
import "./ModalAddGoal.css";
import type { Goal } from "../data/data";

interface ModalAddGoals {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

type GoalPayload = {
  name: string;
  description: string;
  color: string;
  date_set: string;
  deadline?: string;
  everyday?: boolean;
  target_count?: number;
};

function ModalAddGoal({ setIsModalOpen, setGoals }: ModalAddGoals) {
  const today = new Date().toISOString().split("T")[0];
  const [deadlinePresent, setDeadlinePresent] = useState<boolean>(false);
  const [fixedAmount, setFixedAmount] = useState<boolean>(false);
  const [status, setStatus] = useState<"form" | "success" | "error">("form");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload: GoalPayload = {
      name: formData.get("goalName") as string,
      description: formData.get("goalDescription") as string,
      color: formData.get("goalColor") as string,
      date_set: formData.get("goalDate") as string,
      everyday: formData.get("isDaily") === "on",
    };

    if (formData.get("hasDeadline") === "on") {
      const deadline = formData.get("goalDeadline");
      if (deadline) payload.deadline = deadline as string;
    }

    if (formData.get("hasFixedAmount") === "on") {
      const target = formData.get("goalFixedAmount");
      if (target) payload.target_count = Number(target);
    }

    fetch("http://83.136.235.118:8000/goals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((newGoal) => {
        setGoals((prev) => [...prev, newGoal]);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }

  return (
    <div className="modalGoalsOutline">
      <div className="modalGoalsContent">
        <div className="modalGoalsHeader">
          <h2>Создать цель</h2>
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
        {status === "form" ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="goalName">
              <p>Что будешь добиваться?</p>
              <input
                type="text"
                placeholder="Название цели"
                id="goalName"
                required
                name="goalName"
              />
            </label>
            <label htmlFor="goalDescription">
              <p>Как будешь добиваться?</p>
              <input
                type="text"
                placeholder="Описание цели"
                id="goalDescription"
                required
                name="goalDescription"
              />
            </label>
            <label htmlFor="dateSet">
              <p>Дата начала</p>
              <input
                type="date"
                id="dateSet"
                defaultValue={today}
                required
                name="goalDate"
              />
            </label>
            <label htmlFor="deadlinePresent">
              <p>Будет дедлайн</p>
              <input
                type="checkbox"
                id="deadlinePresent"
                onChange={(e) => setDeadlinePresent(e.target.checked)}
                name="hasDeadline"
              />
            </label>
            {deadlinePresent ? (
              <label htmlFor="dateDeadline">
                <p>Дедлайн</p>
                <input
                  type="date"
                  id="dateDeadline"
                  defaultValue={today}
                  required
                  name="goalDeadline"
                />
              </label>
            ) : null}
            <label htmlFor="isDaily">
              <p>Обязательно делать ежедневно</p>
              <input type="checkbox" id="isDaily" name="isDaily" />
            </label>
            <label htmlFor="fixedAmountPresent">
              <p>Будет определённое количество действий на пути к цели</p>
              <input
                type="checkbox"
                id="fixedAmountPresent"
                onChange={(e) => setFixedAmount(e.target.checked)}
                name="hasFixedAmount"
              />
            </label>
            {fixedAmount ? (
              <label htmlFor="daysAmount">
                <p>Сколько раз нужно позаниматься?</p>
                <input
                  type="number"
                  id="daysAmount"
                  required
                  name="goalFixedAmount"
                />
              </label>
            ) : null}

            <div className="colorPickerLabel">
              <p>Цвет цели</p>
              <input type="color" id="color" name="goalColor" />
            </div>
            <button type="submit">Поехали!</button>
          </form>
        ) : null}
        {status === "success" ? <div>Успех</div> : null}
        {status === "error" ? <div>Ошибка</div> : null}
      </div>
    </div>
  );
}

export default ModalAddGoal;
