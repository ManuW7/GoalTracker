import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside>
      <div className="logoDiv">
        <p>logo</p>
        <img src="https://placehold.co/50" alt="" className="logoImg" />
      </div>
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Main
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Settings
        </NavLink>
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Notifications
        </NavLink>
      </nav>
      <div className="accountDiv">
        <img src="src/assets/my_photo.jpg" alt="" className="userPhoto" />
        <img src="https://placehold.co/400" alt="" className="exitLogo" />
      </div>
    </aside>
  );
}

export default Sidebar;
