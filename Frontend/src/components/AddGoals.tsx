import "./addGoals.css";

function AddGoals() {
  return (
    <div className="addGoalsDiv">
      <h3>Add new goals</h3>
      <form action="">
        <div className="setGoalDiv">
          <div>
            <label htmlFor="goalName">Set your goal</label>
            <input type="text" className="goalName" id="goalName" required />
          </div>
          <input type="color" className="goalColor" />
        </div>
        <div className="describeGoalDiv">
          <label htmlFor="goalDescription" className="second-row">
            Describe it
          </label>
          <textarea
            className="goalDescription"
            id="goalDescription"
            required
          ></textarea>
        </div>
        <input type="submit" value="Create" />
      </form>
    </div>
  );
}

export default AddGoals;
