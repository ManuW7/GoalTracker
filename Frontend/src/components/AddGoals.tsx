import type { Goal } from "../data/data";
import "./addGoals.css";
import { useState } from "react";

interface AddGoalsProps {
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

function AddGoals({ setGoals }: AddGoalsProps) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [color, setColor] = useState<string>("#000000");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newGoal = {
      id: -1,
      name: name,
      description: description,
      color: color,
      date_set: new Date().toISOString(),
      user_id: 100,
    };

    const response = await fetch("http://83.136.235.118:8000/goals/", {
      method: "POST",
      body: JSON.stringify(newGoal),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network error");
    }

    const createdGoal = await response.json();

    setGoals((prevGoals) => [...prevGoals, createdGoal]);

    setName("");
    setColor("#000000");
    setDescription("");
  }

  return (
    <div className="addGoalsDiv">
      <h3>Add new goals</h3>
      <form onSubmit={handleSubmit}>
        <div className="setGoalDiv">
          <div>
            <label htmlFor="goalName">Set your goal</label>
            <input
              type="text"
              className="goalName"
              id="goalName"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <input
            type="color"
            className="goalColor"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div className="describeGoalDiv">
          <label htmlFor="goalDescription" className="second-row">
            Describe it
          </label>
          <textarea
            className="goalDescription"
            id="goalDescription"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <input type="submit" value="Create" />
      </form>
    </div>
  );
}

export default AddGoals;
