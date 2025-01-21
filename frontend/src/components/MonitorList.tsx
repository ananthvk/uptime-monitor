import { useQuery } from 'react-query';
import axiosClient from '../axios-client'
import { Link } from 'react-router';
import { Box, Button, Card, CardActionArea } from '@mui/material';
import { Add } from '@mui/icons-material';
import Loader from './Loader';
import MonitorStatusBars from './MonitorStatusBars';

type Monitor = { id: string, name: string, url: string, port: string, type: string, time_interval: number }

function MonitorListItem({ monitor }: { monitor: Monitor }) {
    return <Card sx={{ width: '100%' }}>
        <CardActionArea component={Link} to={`/monitor/${monitor.id}`} sx={{ padding: '1em' }}>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                <h2>
                    {monitor.name}
                </h2>
            </Box>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <p style={{ fontStyle: 'italic' }}>
                    {
                        (monitor.type) === "TCP" ?
                            <>{monitor.url}:{monitor.port}</>
                            : <>{monitor.url}</>
                    }
                </p>

                <p style={{ fontWeight: 'bold' }}>
                    {monitor.type}
                </p>
            </div>
            <MonitorStatusBars refetchInterval={monitor.time_interval} monitor_id={parseInt(monitor.id)} numberOfBars={20} />
        </CardActionArea>
    </Card>
}


const retrieveMonitors = async (): Promise<Monitor[]> => {
    const response = await axiosClient.get("monitor");
    return response.data as Monitor[]
}

function MonitorList() {
    const {
        data: monitors,
        error,
        isLoading
    } = useQuery("monitorsData", retrieveMonitors)

    if (isLoading)
        return <Loader />
    if (!monitors || error) return <div>Error occured while fetching data from server {(error as any).message} </div>

    return <Box display="flex" flexDirection="column" justifyItems="center" alignItems="center">
        <h1>
            Dashboard
        </h1>
        <Box
            display="flex"
            flexDirection="column"
            justifyItems="center"
            alignItems="center"
            sx={{
                width: {
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%'
                }
            }}
            gap={3}
        >

            <Box display="flex" flexDirection="row" justifyContent="flex-end" width="100%">
                <Button variant='contained' component={Link} to="/monitor/new">
                    <Add />
                    New Monitor
                </Button>
            </Box>
            {
                monitors.map(monitor =>
                    <MonitorListItem key={monitor.id} monitor={monitor} />
                )
            }
        </Box>
    </Box >
}
export default MonitorList