import GoalCheckbox from "./GoalCheckbox";
import "./GoalNote.css";

function GoalNote() {
  return (
    <div className="goalNote">
      <div className="infoHeader">
        <div className="goalNameWrapper">
          <div
            className="goalColor"
            style={{ backgroundColor: "#000000" }}
          ></div>
          <p className="goalName">Пить воду</p>
        </div>
        <div className="goalStat">{`6/7`}</div>
      </div>
      <div className="weekActionsDiv">
        <GoalCheckbox></GoalCheckbox>
        <GoalCheckbox></GoalCheckbox>
        <GoalCheckbox></GoalCheckbox>
        <GoalCheckbox></GoalCheckbox>
        <GoalCheckbox></GoalCheckbox>
        <GoalCheckbox></GoalCheckbox>
        <GoalCheckbox></GoalCheckbox>
      </div>
    </div>
  );
}

export default GoalNote;
