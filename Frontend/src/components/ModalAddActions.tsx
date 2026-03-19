import { act } from "react";
import type { Action } from "../data/data";
import "./ModalAddAcrions.css";

interface ModalAddActionsProps {
  actions: Action[];
  goalId: number;
  setWeekActions: React.Dispatch<React.SetStateAction<Action[]>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ModalAddActions({
  actions,
  goalId,
  setWeekActions,
  setIsModalOpen,
}: ModalAddActionsProps) {
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
          <button className="createActionButton">+</button>
        </div>
      </div>
    </div>
  );
}

export default ModalAddActions;
