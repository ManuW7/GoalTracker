import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Layout.css";

function Layout() {
  return (
    <div className="layout">
      <Sidebar></Sidebar>
      <main>
        <Outlet></Outlet>
      </main>
    </div>
  );
}

export default Layout;
