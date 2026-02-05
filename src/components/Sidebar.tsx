import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside>
      <div className="logoDiv"></div>
      <nav>
        <NavLink to="/">Main</NavLink>
        <NavLink to="/settings">Settings</NavLink>
        <NavLink to="/notifications">Notifications</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
