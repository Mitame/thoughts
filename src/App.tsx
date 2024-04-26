import { lazy } from "react";
import ThoughtStorageProvider from "./providers/ThoughtStorageProvider";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
const HistoryPage = lazy(() => import("./pages/history/HistoryPage"));
const EntryPage = lazy(() => import("./pages/entry/EntryPage"));

function App() {
  return (
    <ThoughtStorageProvider>
      <Sidebar />

      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </ThoughtStorageProvider>
  );
}

export default App;
