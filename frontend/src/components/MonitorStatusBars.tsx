import { useQuery } from 'react-query';
import axiosClient from '../axios-client';
import Loader from './Loader';
import './MonitorStatusBars.css'

type Status = "SUCCESS" | "FAILURE" | "UNKNOWN"
// Add one second extra delay before refetching
const additionalRefectDelay = 1000

const retrieveLastNStatusChecks = async (monitor_id: number, numberOfStatus: number): Promise<Status[]> => {
    const response = await axiosClient.get<Status[]>(`status/${monitor_id}/latest?n=${numberOfStatus}`);
    return response.data
}

// Note: refetchInterval is in seconds
function MonitorStatusBars({ monitor_id, refetchInterval, numberOfBars }: { monitor_id: number, refetchInterval: number, numberOfBars: number }) {
    const {
        data: statuses,
        error,
        isLoading
    } = useQuery(`${monitor_id}statusBarData-${numberOfBars}`, () => retrieveLastNStatusChecks(monitor_id, numberOfBars), { refetchInterval: (refetchInterval * 1000) + additionalRefectDelay })

    if (isLoading)
        return <Loader />
    if (!statuses || error) return <div>Error occured while fetching data from server {(error as any).message} </div>

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