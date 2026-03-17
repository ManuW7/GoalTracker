import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Settings from "./components/Settings";
import Dashboard from "./components/Dashboard";
import Notifications from "./components/Notifications";
import Layout from "./components/Layout";
import Calendar from "./components/Calendar";
import Auth from "./components/Auth";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<Auth></Auth>}></Route>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout></Layout>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard></Dashboard>}></Route>
          <Route path="settings" element={<Settings></Settings>}></Route>
          <Route
            path="notifications"
            element={<Notifications></Notifications>}
          ></Route>
          <Route path="calendar" element={<Calendar></Calendar>}></Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />}></Route>
      </Routes>
    </>
  );
}

export default App;
