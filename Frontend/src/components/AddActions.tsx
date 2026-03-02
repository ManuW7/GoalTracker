import "./addActions.css";
import type { Goal, Action } from "../data/data";
import { useState } from "react";

interface AddActionsProps {
  goals: Goal[];
  setActions: React.Dispatch<React.SetStateAction<Action[]>>;
}

function AddActions({ goals, setActions }: AddActionsProps) {
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [selectedGoalName, setSelectedGoalName] = useState<string>(
    goals[0]?.name ?? "",
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const selectedGoal = goals.find((g) => g.name === selectedGoalName);

    const newAction: Action = {
      id: -1,
      name: "",
      goal_id: selectedGoal?.id ?? 0,
      description: description,
      date: date,
      user_id: 100,
    };

    const response = await fetch("http://83.136.235.118:8000/actions", {
      method: "POST",
      body: JSON.stringify(newAction),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network error");
    }

    const createdActionData = await response.json();
    const createdAction: Action = {
      ...createdActionData,
      date: new Date(createdActionData.date),
    };

    setActions((prevActions) => [...prevActions, createdAction]);

    setDate(new Date());
    setDescription("");
  }

  return (
    <div className="addActionDiv">
      <form onSubmit={handleSubmit}>
        <div className="headerWithDate">
          <h3>Add new actions</h3>
          <input
            type="date"
            name="actionDate"
            value={date.toISOString().split("T")[0]}
            onChange={(e) => setDate(new Date(e.target.value))}
            required
          />
        </div>
        <div className="choseGoalDiv">
          <label htmlFor="goalsOptions">What goal are you persuing?</label>
          <select
            name="goalsOptions"
            id="goalsOptions"
            required
            value={selectedGoalName}
            onChange={(e) => setSelectedGoalName(e.target.value)}
          >
            {goals.map((goal) => (
              <option key={goal.id} value={goal.name}>
                {goal.name}
              </option>
            ))}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <input type="submit" value={"Submit"} />
      </form>
    </div>
  );
}

export default AddActions;
