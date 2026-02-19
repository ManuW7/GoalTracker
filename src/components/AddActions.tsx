import "./addActions.css";

function AddActions() {
  return (
    <div className="addActionDiv">
      <form action="">
        <div className="headerWithDate">
          <h3>Add new actions</h3>
          <input type="date" name="actionDate" required />
        </div>
        <div className="choseGoalDiv">
          <label htmlFor="goalsOptions">What goal are you persuing?</label>
          <select name="goalsOptions" id="goalsOptions" required>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
          </select>
        </div>
        <div className="actionDescriptionContainer">
          <label htmlFor="actionDescription">
            Describe your action towards that goal
          </label>
          <textarea
            name="actionDescription"
            id="actionDescription"
            required
          ></textarea>
        </div>
        <input type="submit" value={"Submit"} />
      </form>
    </div>
  );
}

export default AddActions;
