import EntryPage from './pages/entry/EntryPage'
import HistoryPage from './pages/history/HistoryPage'
import ThoughtStorageProvider from './providers/ThoughtStorageProvider'

function App() {
  return (
    <>
      <ThoughtStorageProvider>
        <HistoryPage />
        <EntryPage />
      </ThoughtStorageProvider>
    </>
  )
}

export default App
