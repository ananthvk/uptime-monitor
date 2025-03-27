import './App.css'
import { BrowserRouter, Link, Route, Routes } from 'react-router'
import MonitorList from './components/MonitorList'
import EditMonitor from './components/EditMonitor'
import MonitorDetail from './components/MonitorDetail'
import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import LoginButton from './components/LoginButton'
import { useAuth0 } from '@auth0/auth0-react'
import LogoutButton from './components/LogoutButton'
import Profile from './components/Profile'
import IndexPage from './components/IndexPage'
import AuthGuard from './components/AuthGuard'

function App() {
    const { isAuthenticated } = useAuth0()
    return (
        <BrowserRouter>
            <AppBar position="static" enableColorOnDark>
                <Toolbar sx={{ gap: 3 }}>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        Uptime Monitor
                    </Typography>
                    <Button color="info" variant='contained' component={Link} to="/dashboard">Dashboard</Button>
                    {isAuthenticated ? <LogoutButton /> : <LoginButton />}
                    <Profile />
                </Toolbar>
            </AppBar>
            <Routes>
                <Route path="/" element={<IndexPage />} />
                <Route path="/dashboard" element={<AuthGuard component={MonitorList} />} />
                <Route path="monitor">
                    <Route path=":monitor_id" element={<AuthGuard component={MonitorDetail} />} />
                    <Route path=":monitor_id/edit" element={<AuthGuard component={EditMonitor} props={{ isEdit: true }} />} />
                    <Route path="new" element={<AuthGuard component={EditMonitor} props={{ isEdit: false }} />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App

