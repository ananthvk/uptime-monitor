import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import axiosClient from "../axios-client";
import { useQuery } from "react-query";
import Loader from "./Loader";


type StatusDetailed = { date: Date, response_time: number, result: 'SUCCESS' | 'FAILURE' }

const additionalRefectDelay = 1000

const retrieveLastNStatusChecksDetailed = async (monitor_id: number, numberOfStatus: number): Promise<StatusDetailed[]> => {
    const response = await axiosClient.get<StatusDetailed[]>(`status/${monitor_id}/latest/detailed?n=${numberOfStatus}`);
    response.data.reverse()
    return response.data.map(dataPoint => { return { ...dataPoint, time: new Date(dataPoint.date).toLocaleTimeString() } })
}

function MonitorResponseTimeGraph({ monitor_id, refetchInterval, numberOfDataPoints }: { monitor_id: number, refetchInterval: number, numberOfDataPoints: number }) {
    const {
        data: statuses,
        error,
        isLoading
    } = useQuery(`${monitor_id}statusBarDataDetailed-${numberOfDataPoints}`,
        () => retrieveLastNStatusChecksDetailed(monitor_id, numberOfDataPoints),
        { refetchInterval: (refetchInterval * 1000) + additionalRefectDelay }
    )

    if (isLoading)
        return <Loader />
    if (!statuses || error) return <div>Error occured while fetching data from server {(error as any).message} </div>

    return <AreaChart
        width={800}
        height={300}
        data={statuses}
        margin={{
            top: 30,
            right: 30,
            left: 20,
            bottom: 5,
        }}
    >
        <defs>
            <linearGradient id="colorResponseTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="green" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#88c0d0" stopOpacity={0.5} />
            </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="response_time" stroke="00ff00" activeDot={{ r: 8 }} fill="url(#colorResponseTime)" />
    </AreaChart>
}
export default MonitorResponseTimeGraph;