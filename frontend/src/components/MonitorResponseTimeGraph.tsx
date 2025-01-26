import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import axiosClient from "../axios-client";
import { useQuery } from "react-query";
import Loader from "./Loader";
import { TooltipProps } from "recharts";
import { additionalRefectDelay, StatusDetailed } from "../types";


const retrieveLastNStatusChecksDetailed = async (monitor_id: number, numberOfStatus: number): Promise<StatusDetailed[]> => {
    const response = await axiosClient.get<StatusDetailed[]>(`status/${monitor_id}/latest/detailed?n=${numberOfStatus}`);
    response.data.reverse()
    return response.data.map(dataPoint => { return { ...dataPoint, time: new Date(dataPoint.date).toLocaleTimeString() } })
}

const trunc = (s: string | undefined, n: number): string => {
    if (!s) {
        return ''
    }
    return s.length > n ? s.substring(0, n) + '...' : s;
}


const ResponseTimeTooltip = ({ active, payload }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
        const data: StatusDetailed = payload[0].payload;
        const responseTime = data.response_time;

        return (
            <div style={{ backgroundColor: 'white', padding: '0.5em', border: '1px solid lightgray' }}>
                {data.result === 'FAILURE' ? <p>Error: {trunc(data.error_reason, 50)}</p> : <p>{`Response Time: ${responseTime} ms`}</p>}
            </div>
        );
    }

    return null;
};


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
    if (!statuses)
        return <div>Could not retrieve status list from server</div>
    if (error && error instanceof Error)
        return <div>Error while fetching data: {error.message}</div>

    return <AreaChart
        width={1000}
        height={400}
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
        <Tooltip content={ResponseTimeTooltip} />
        <Legend />
        <Area type="monotone" dataKey="response_time" stroke="00ff00" activeDot={{ r: 8 }} fill="url(#colorResponseTime)" />
    </AreaChart>
}
export default MonitorResponseTimeGraph;