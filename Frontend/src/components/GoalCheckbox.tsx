import { useState } from "react";
import "./GoalCheckbox.css";
import type { Action } from "../data/data";
import ModalAddActions from "./ModalAddActions";

interface GoalCheckboxProps {
  isActive: boolean;
  setWeekActions: React.Dispatch<React.SetStateAction<Action[]>>;
  goalID: number;
  date: Date;
  actions: Action[];
}

function GoalCheckbox({
  actions,
  isActive,
  setWeekActions,
  goalID,
  date,
}: GoalCheckboxProps) {
  const [dayState, setDayState] = useState<"active" | "unactive">("unactive");
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

  function handleClick() {
    if (!isActive) return;
    setIsModalOpened(true);
  }

  return (
    <div className="goalCheckbox">
      <button
        className={`actionCheckMark ${isActive ? dayState : "disabled"}`}
        onClick={handleClick}
        disabled={!isActive}
      >
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
      {isModalOpened ? (
        <ModalAddActions
          goalId={goalID}
          setWeekActions={setWeekActions}
          actions={actions}
          setIsModalOpen={setIsModalOpened}
        ></ModalAddActions>
      ) : null}
    </div>
  );
}

export default GoalCheckbox;
