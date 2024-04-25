import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import {
  Thought,
  ThoughtStorageContext,
} from "../../providers/ThoughtStorageProvider";
import styles from "./HistoryPage.module.css";

type DateT = string & { readonly tag: unique symbol };

function getDateFromTimestamp(timestamp: Date): DateT {
  return `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}` as DateT;
}

export default function HistoryPage() {
  const thoughtStorage = useContext(ThoughtStorageContext);

  const [thoughts, setThoughts] = useState<Thought[]>();
  useEffect(() => {
    thoughtStorage
      .retrieveThoughts()
      .then((thoughts) => setThoughts(thoughts))
      .catch((e) => {
        console.error(e);
      });
  }, [thoughtStorage]);

  const thoughtsGroupedByDate = useMemo(() => {
    const thoughtsGroupedByDate: { date: DateT; thoughts: Thought[] }[] = [];
    if (thoughts === undefined) {
      return thoughtsGroupedByDate;
    }

    const sortedThoughts = [...thoughts].sort();
    for (const thought of sortedThoughts) {
      const lastEntry = thoughtsGroupedByDate[thoughtsGroupedByDate.length - 1];
      const thoughtDate = getDateFromTimestamp(thought.timestamp);
      if (lastEntry?.date === thoughtDate) {
        lastEntry.thoughts.push(thought);
      } else {
        thoughtsGroupedByDate.push({
          date: thoughtDate,
          thoughts: [thought],
        });
      }
    }

    return thoughtsGroupedByDate;
  }, [thoughts]);

  return (
    <div className={styles.page}>
      {thoughtsGroupedByDate.map(({ thoughts, date }) => (
        <ThoughtGroup key={date} thoughts={thoughts} />
      ))}
    </div>
  );
}

export function DateRow({ date }: { date: string }) {
  return (
    <div className={styles.dateRow}>
      <h2>{date}</h2>
    </div>
  );
}

export function ThoughtGroup({ thoughts }: { thoughts: Thought[] }) {
  const dateFormatter = Intl.DateTimeFormat();
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    timeStyle: "short",
  });

  const date = dateFormatter.format(thoughts[0].timestamp);
  return (
    <>
      <DateRow date={date} />
      {thoughts.map((thought, i) => {
        const previousThought = thoughts[i - 1];
        const isNewSession =
          !previousThought ||
          thought.timestamp.valueOf() - previousThought.timestamp.valueOf() >
            5 * 60 * 1000;

        const time = timeFormatter.format(thought.timestamp);

        return (
          <Fragment key={i}>
            <span className={styles.time} data-new-session={isNewSession}>
              {time}
            </span>
            <span className={styles.thought}>{thought.body}</span>
          </Fragment>
        );
      })}
    </>
  );
}
