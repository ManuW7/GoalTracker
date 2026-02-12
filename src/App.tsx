import "./App.css";
import { Routes, Route } from "react-router-dom";
import Settings from "./components/Settings";
import Dashboard from "./components/Dashboard";
import Notifications from "./components/Notifications";
import Layout from "./components/Layout";
import Calendar from "./components/Calendar";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout></Layout>}>
          <Route index element={<Dashboard></Dashboard>}></Route>
          <Route path="settings" element={<Settings></Settings>}></Route>
          <Route
            path="notifications"
            element={<Notifications></Notifications>}
          ></Route>
          <Route path="calendar" element={<Calendar></Calendar>}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
