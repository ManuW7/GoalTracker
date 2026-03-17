import { useState } from "react";
import "./GoalCheckbox.css";
import type { Action } from "../data/data";
import ModalAddActions from "./ModalAddActions";

function GoalCheckbox() {
  const [todayActions, setTodayActions] = useState<Action[]>([]);
  const [dayState, setDayState] = useState<"active" | "unactive">("unactive");
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

  function handleClick() {
    setIsModalOpened(true);
  }

  return (
    <div className="goalCheckbox">
      <button className={`actionCheckMark ${dayState}`} onClick={handleClick}>
        <svg
          width="19"
          height="12"
          viewBox="0 0 19 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.5 4.77273L8.57692 10.5L17.5 1.5"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isModalOpened ? <ModalAddActions></ModalAddActions> : null}
    </div>
  );
}

export default GoalCheckbox;
