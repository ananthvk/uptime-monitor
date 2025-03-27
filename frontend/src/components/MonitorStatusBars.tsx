import { useQuery } from 'react-query';
import axiosClient, { useAxiosWithAuth } from '../axios-client';
import Loader from './Loader';
import './MonitorStatusBars.css'
import { Status } from '../types';
import { additionalRefectDelay } from "../constants";

const retrieveLastNStatusChecks = async (monitor_id: number, numberOfStatus: number): Promise<Status[]> => {
    const response = await axiosClient.get<Status[]>(`status/${monitor_id}/latest?n=${numberOfStatus}`);
    return response.data
}

// Note: refetchInterval is in seconds
function MonitorStatusBars({ monitor_id, refetchInterval, numberOfBars }: { monitor_id: number, refetchInterval: number, numberOfBars: number }) {
    useAxiosWithAuth();
    const {
        data: statuses,
        error,
        isLoading
    } = useQuery(`${monitor_id}statusBarData-${numberOfBars}`, () => retrieveLastNStatusChecks(monitor_id, numberOfBars), { refetchInterval: (refetchInterval * 1000) + additionalRefectDelay })

    if (isLoading)
        return <Loader />
    if (!statuses)
        return <div>Could not retrieve status list from server</div>
    if (error && error instanceof Error)
        return <div>Error while fetching data: {error.message}</div>

    const statusesPadded = Array(Math.max(0, numberOfBars - statuses.length)).fill("UNKNOWN").concat(statuses.slice().reverse());

    const bars = statusesPadded.map((x, i) => {
        if (x === 'FAILURE')
            return <div key={`bar-${i}`} className='bar red' />
        else if (x === 'SUCCESS')
            return <div key={`bar-${i}`} className='bar green' />
        else
            return <div key={`bar-${i}`} className='bar gray' />

    });
    return <div className="bar-container">
        {
            bars
        }
    </div>

}
export default MonitorStatusBars;