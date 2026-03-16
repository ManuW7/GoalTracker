import { useState } from "react";
import "./ModalAddGoal.css";

interface ModalAddGoals {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ModalAddGoal({ setIsModalOpen }: ModalAddGoals) {
  const today = new Date().toISOString().split("T")[0];
  const [deadlinePresent, setDeadlinePresent] = useState<boolean>(false);

  return (
    <div className="modalGoalsOutline" onClick={() => setIsModalOpen(false)}>
      <div className="modalGoalsContent" onClick={(e) => e.stopPropagation()}>
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
                stroke-width="4"
                stroke-linejoin="round"
              />
              <path
                d="M23.9141 1.41421L1.41406 23.9142"
                stroke="black"
                stroke-width="4"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <form action="">
          <label htmlFor="goalName">
            <p>Что будешь добиваться?</p>
            <input
              type="text"
              placeholder="Название цели"
              id="goalName"
              required
            />
          </label>
          <label htmlFor="goalDescription">
            <p>Как будешь добиваться?</p>
            <input
              type="text"
              placeholder="Описание цели"
              id="goalDescription"
              required
            />
          </label>
          <label htmlFor="dateSet">
            <p>Дата начала</p>
            <input type="date" id="dateSet" defaultValue={today} required />
          </label>
          <label htmlFor="deadlinePresent">
            <p>Будет дедлайн</p>
            <input
              type="checkbox"
              id="deadlinePresent"
              onChange={(e) => setDeadlinePresent(e.target.checked)}
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
              />
            </label>
          ) : null}
          {deadlinePresent ? (
            <label htmlFor="isDaily">
              <p>Обязательно делать ежедневно</p>
              <input type="checkbox" id="isDaily" />
            </label>
          ) : null}
          {deadlinePresent}
          <label htmlFor="daysAmount">
            <p>Сколько раз нужно позаниматься?</p>
            <input type="number" id="daysAmount" required />
          </label>
          <button type="submit">Поехали!</button>
        </form>
      </div>
    </div>
  );
}

export default ModalAddGoal;
