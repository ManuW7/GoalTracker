import "./addActions.css";

function AddActions() {
  return (
    <div className="addActionDiv">
      <h3>Add new actions</h3>
      <form action="">
        <div className="choseGoalDiv">
          <label htmlFor="goalsOptions">What goal are you persuing?</label>
          <select name="goalsOptions" id="goalsOptions">
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
          </select>
        </div>
        <div className="actionDescriptionContainer">
          <label htmlFor="actionDescription">
            Describe your action towards that goal
          </label>
          <textarea name="actionDescription" id="actionDescription"></textarea>
        </div>
        <input type="submit" value={"Submit"} />
      </form>
    </div>
  );
}

export default AddActions;
