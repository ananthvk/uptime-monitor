import { useQuery } from 'react-query';
import axiosClient from '../axios-client'
import './MonitorList.css'

type Monitor = { id: string, name: string, url: string, port: string, type: string }

function MonitorListItem({ monitor }: { monitor: Monitor }) {
    return <div className='list-item'>
        <h2>
            {monitor.name}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <p style={{ fontStyle: 'italic' }}>
                {monitor.url}:{monitor.port}
            </p>
            <p style={{ fontWeight: 'bold' }}>
                {monitor.type}
            </p>
        </div>
    </div>
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

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error occured while fetching data from server {(error as any).message} </div>

    return <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', alignItems: 'center' }}>
        <h1>
            List of monitors
        </h1>
        {
            monitors?.map(monitor =>
                <MonitorListItem key={monitor.id} monitor={monitor} />
            )
        }
    </div>
}
export default MonitorList