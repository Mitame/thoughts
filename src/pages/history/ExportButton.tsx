import { useRef, useCallback } from "react";
import { Thought } from "../../providers/ThoughtStorageProvider";
import papaparse from "papaparse";

export default function ExportButton({ thoughts }: { thoughts: Thought[] }) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const onClick = useCallback(() => {
    if (linkRef.current == null) {
      return;
    }
    const csvData = papaparse.unparse(thoughts);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    linkRef.current.href = url;
    linkRef.current.download = "thoughts-export.csv";
    linkRef.current.click();
  }, [thoughts]);

  return (
    <>
      <button onClick={onClick}>Export</button>
      <a ref={linkRef} />
    </>
  );
}
