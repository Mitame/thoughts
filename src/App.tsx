import { lazy } from "react";
import ThoughtStorageProvider from "./providers/ThoughtStorageProvider";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
const HistoryPage = lazy(() => import("./pages/history/HistoryPage"));
const EntryPage = lazy(() => import("./pages/entry/EntryPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <EntryPage />,
  },
  {
    path: "/history",
    element: <HistoryPage />,
  },
]);

function App() {
  return (
    <>
      <ThoughtStorageProvider>
        <RouterProvider router={router} />
      </ThoughtStorageProvider>
    </>
  );
}

export default App;
