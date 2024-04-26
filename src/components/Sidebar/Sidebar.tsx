import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";

export type Props = {};

export default function Sidebar({}: Props) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.drawer}>
        <Link className={styles.link} to="/">
          Home
        </Link>
        <Link className={styles.link} to="/history">
          History
        </Link>
      </div>
    </div>
  );
}
