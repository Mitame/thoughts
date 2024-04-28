import { ChangeEvent, useCallback, useRef } from "react";
import { Thought } from "../../providers/ThoughtStorageProvider";
import Hidden from "../../components/Hidden/Hidden";
import papaparse from "papaparse";

export type Props = {
  onImport: (thoughts: Thought[]) => Promise<void>;
};

export default function ImportButton({ onImport }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const onFileSelection = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();

      const file = event.currentTarget.files?.[0];
      if (file == undefined) {
        console.debug("No file selected");
        return;
      }

      const parseFile = new Promise<unknown[]>((res, rej) => {
        papaparse.parse(file!, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            if (result.errors.length) {
              rej(result.errors);
            } else {
              res(result.data);
            }
          },
        });
      });

      parseFile
        .then((data) => {
          return data.map((d) => validateThought(d));
        })
        .then((thoughts) => {
          for (const thought of thoughts) {
            if (thought === undefined) {
              throw "Format error";
            }
          }

          return thoughts as Thought[];
        })
        .then(onImport)
        .then(() => {
          console.log("complete");
        });
    },
    [onImport],
  );

  return (
    <>
      <button onClick={() => fileRef.current?.click()}>Import</button>
      <Hidden>
        <input ref={fileRef} type="file" onChange={onFileSelection} />
      </Hidden>
    </>
  );
}

function validateThought(data: unknown): Thought | undefined {
  if (typeof data !== "object" || data == undefined) {
    return undefined;
  }
  if (!("timestamp" in data && "body" in data)) {
    return undefined;
  }
  if (typeof data.timestamp !== "string" || typeof data.body !== "string") {
    return undefined;
  }

  return {
    timestamp: new Date(data.timestamp),
    body: data.body,
  };
}
