import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import clsx from "clsx";

function navLinkStyle({ isActive }: { isActive: boolean }) {
  return clsx(styles.link, isActive && styles.active);
}

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.drawer}>
        <NavLink className={navLinkStyle} to="/">
          Home
        </NavLink>
        <NavLink className={navLinkStyle} to="/history">
          History
        </NavLink>
      </div>
    </div>
  );
}
