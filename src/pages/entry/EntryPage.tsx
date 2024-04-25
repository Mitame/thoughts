import { FormEvent, useCallback, useContext, useRef } from "react";
import styles from "./EntryPage.module.css";
import { ThoughtStorageContext } from "../../providers/ThoughtStorageProvider";

export default function EntryPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const thoughtStorage = useContext(ThoughtStorageContext);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (inputRef.current == null) {
        return;
      }

      // Store the thought
      const thought = inputRef.current.value;

      thoughtStorage.storeThought({
        timestamp: new Date(),
        body: thought,
      });

      // Clear the input
      inputRef.current.value = "";

      // Show a saved notification
    },
    [thoughtStorage],
  );

  return (
    <div className={styles.page}>
      {/* Centered on page */}
      <div>
        <h1>How are you feeling?</h1>

        <form onSubmit={onSubmit}>
          <input ref={inputRef} type="text" placeholder="I feel..." />
          <input type="submit" value="➡️" />
        </form>
      </div>
      {/* Some toast section */}
    </div>
  );
}
