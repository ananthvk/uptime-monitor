import { Typography } from '@mui/material';
import './IndexPage.css'
const IndexPage = () => {
    return <div className='home-page'>
        <div className='container'>
            <Typography variant='h1' color='#04a5e5' fontWeight={800}>
                Uptime Monitor
            </Typography>
            <Typography variant='h4' color='#006f9c' fontWeight={600}>
            "⚡ Uptime Monitor – Stay Online, Stay Ahead! 🌐✅"
            </Typography>
        </div>
    </div>
}

export default IndexPage;