import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import MonitorList from './components/MonitorList'
import CreateMonitor from './components/CreateMonitor'
import MonitorDetail from './components/MonitorDetail'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/dashboard" element={<MonitorList />} />
                <Route path="monitor">
                    <Route path=":monitor_id" element={<MonitorDetail />} />
                    <Route path="new" element={<CreateMonitor />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
