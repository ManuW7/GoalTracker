import "./Dashboard.css";

import { useEffect, useState } from "react";
import type { Goal, Action } from "../data/data";
import WeekCalendar from "./WeekCalendar";

function Dashboard() {
  return (
    <div className="dashboardDiv">
      <div className="dashboardGridDiv">
        <WeekCalendar></WeekCalendar>
      </div>
    </div>
  );
}

export default Dashboard;
