import './App.css'
import { BrowserRouter, Link, Route, Routes } from 'react-router'
import MonitorList from './components/MonitorList'
import CreateMonitor from './components/CreateMonitor'
import EditMonitor from './components/EditMonitor'
import MonitorDetail from './components/MonitorDetail'
import { AppBar, Button, Toolbar, Typography } from '@mui/material'

function App() {
    return (
        <BrowserRouter>
            <AppBar position="static" enableColorOnDark>
                <Toolbar sx={{gap: 3}}>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        Uptime Monitor
                    </Typography>
                    <Button color="info" variant='contained' component={Link} to="/dashboard">Dashboard</Button>
                    <Button color="inherit" variant='contained'>Login</Button>
                </Toolbar>
            </AppBar>
            <Routes>
                <Route path="/dashboard" element={<MonitorList />} />
                <Route path="monitor">
                    <Route path=":monitor_id" element={<MonitorDetail />} />
                    <Route path=":monitor_id/edit" element={<EditMonitor />} />
                    <Route path="new" element={<CreateMonitor />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
