import { PropsWithChildren, createContext, useMemo } from "react";

export type Thought = {
    timestamp: Date,
    body: string,
}

type ThoughtStorageContextT = {
    storeThought: (thought: Thought) => Promise<void>;
    retrieveThoughts: () => Promise<Thought[]>;
};

export const ThoughtStorageContext = createContext<ThoughtStorageContextT>({
    storeThought() {return Promise.reject()},
    retrieveThoughts() {
        return Promise.reject();
    },
})

function openDatabase(name: string, version?: number): Promise<IDBDatabase> {
    return new Promise((res, rej) => {
        const request = window.indexedDB.open(name, version);

        request.onsuccess = (event) => {
            console.debug(event);
            res(request.result)
        }

        request.onerror = (event) => {
            console.error("Database open failed with error", event)
            rej(event)
        }

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            console.debug(event);
            upgradeDatabase(request.result, event.oldVersion, event.newVersion ?? latestDatabaseVersion).then(() => {
                console.log("upgraded");
            });
        }
    })
}

type DatabaseUpgrade = (database: IDBDatabase) => Promise<void>;

const upgrades: DatabaseUpgrade[] = [performDatabaseUpgrade1]
const latestDatabaseVersion = upgrades.length;

async function upgradeDatabase(database: IDBDatabase, currentVersion: number, targetVersion: number) {
    const upgradesToPerform = upgrades.slice(currentVersion - 1, targetVersion);

    for (const upgrade of upgradesToPerform) {
        await upgrade(database);
    }
}

const OBJECT_STORE_NAME = "thoughts"

async function performDatabaseUpgrade1(database: IDBDatabase): Promise<void> {
    const thoughtsStore = database.createObjectStore(OBJECT_STORE_NAME, {autoIncrement: true});

    thoughtsStore.createIndex("timestamp", "timestamp", {unique: true});
    thoughtsStore.createIndex("body", "body", {});

    return new Promise((res, rej) => {
        thoughtsStore.transaction.oncomplete = () => {
            console.log("upgrade complete")
            res(undefined);
        }
        thoughtsStore.transaction.onerror = (event) => {
            console.error(event);
            rej(event)
        }
    })

}


export default function ThoughtStorageProvider({ children }: PropsWithChildren) {
    const database = useMemo(() => openDatabase(OBJECT_STORE_NAME, latestDatabaseVersion), []);

    const context: ThoughtStorageContextT = useMemo(() => ({
        async storeThought(thought) {
            await database.then(db => {
                const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
                return new Promise((res, rej) => {
                    const thoughtsStore = transaction.objectStore(OBJECT_STORE_NAME);
                    thoughtsStore.add(thought);

                    transaction.oncomplete = () => {
                        res(null);
                    }
                    transaction.onerror = (event) => {
                        console.error(event);
                        rej(event);
                    }
                })
            })
        },
        async retrieveThoughts() {
            return database.then(db => {
                const transaction = db.transaction([OBJECT_STORE_NAME], "readonly");
                return new Promise((res, rej) => {
                    const thoughtsStore = transaction.objectStore(OBJECT_STORE_NAME);
                    const request = thoughtsStore.getAll();

                    request.onsuccess = () => {
                        res(request.result);
                    }
                    request.onerror = (event) => {
                        console.error(event);
                        rej(event);
                    }
                })
            })
        },
    }), [database])


    return <ThoughtStorageContext.Provider value={context}>
        {children}
    </ThoughtStorageContext.Provider>
}