import { useParams } from "react-router"
import axiosClient from "../axios-client";
import { useQuery } from "react-query";
import { Box } from "@mui/material";
import Loader from "./Loader";
import EditDeleteMonitorButton from "./EditDeleteMonitorButton";
import MonitorStatusBars from "./MonitorStatusBars";
import MonitorResponseTimeGraph from "./MonitorResponseTimeGraph";

const numberOfDataPointsInStatusBar = 30
const numberOfDataPointsInGraph = 10

type Monitor = { id: string, name: string, url: string, port: string, type: string, time_interval: number }

const retrieveMonitorDetail = async (id: string): Promise<Monitor> => {
    const response = await axiosClient.get(`monitor/${id}`);
    return response.data as Monitor
}

function MonitorDetail() {
    const { monitor_id } = useParams<{ monitor_id: string }>()
    if (!monitor_id) {
        return <div>Not Found</div>
    }
    const {
        data: monitor,
        error,
        isLoading
    } = useQuery(
        ['monitorData', monitor_id],
        () => { return retrieveMonitorDetail(monitor_id) },
        { enabled: !!monitor_id }
    )

    if (isLoading) return <Loader />
    if (error) {
        if ((error as any).status === 404)
            return <h1>404 Not Found</h1>
        return <div>Error occured while fetching data from server {(error as any).message} </div>
    }
    if (!monitor) {
        return <div>Error occured</div>
    }


    return <Box
        sx={{
            width: {
                xs: '90%',
                sm: '80%',
                md: '50%',
                lg: '40%',
                xl: '30%'
            },
            outline: '1px lightgray solid',
            padding: '1em'
        }}
        marginTop="1em"
        marginLeft="1em">
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
            <h1>
                {monitor.name}
            </h1>
            <EditDeleteMonitorButton monitor_id={monitor_id} />
        </Box>
        <p>
            {monitor.type}
        </p>
        <p>
            {
                (monitor.type) === "TCP" ?
                    <>{monitor.url}:{monitor.port}</>
                    : <>{monitor.url}</>
            }
        </p>
        <p>
            Check every {monitor.time_interval}s
        </p>
        <MonitorStatusBars monitor_id={parseInt(monitor_id)} numberOfBars={numberOfDataPointsInStatusBar} refetchInterval={monitor.time_interval} />
        <MonitorResponseTimeGraph monitor_id={parseInt(monitor_id)} numberOfDataPoints={numberOfDataPointsInGraph} refetchInterval={monitor.time_interval} />
    </Box >
}


export default MonitorDetail;