import { PropsWithChildren } from "react";
import styles from "./Hidden.module.css";

export default function Hidden({ children }: PropsWithChildren) {
  return <div className={styles.hidden}>{children}</div>;
}
