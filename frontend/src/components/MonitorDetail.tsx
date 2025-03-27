import { useParams } from "react-router"
import axiosClient, { useAxiosWithAuth } from "../axios-client";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import { Box, Button } from "@mui/material";
import Loader from "./Loader";
import EditDeleteMonitorButton from "./EditDeleteMonitorButton";
import MonitorStatusBars from "./MonitorStatusBars";
import MonitorResponseTimeGraph from "./MonitorResponseTimeGraph";
import { MonitorReduced } from "../types";
import { numberOfDataPointsInGraph, numberOfDataPointsInStatusBar } from "../constants";
import { useAuth0 } from '@auth0/auth0-react'

const retrieveMonitorDetail = async (id: string): Promise<MonitorReduced> => {
    const response = await axiosClient.get<MonitorReduced>(`monitor/${id}`);
    return response.data
}

const deleteHistory = async (queryClient: QueryClient, id: string): Promise<void> => {
    await axiosClient.delete(`status/${id}`)
    queryClient.refetchQueries({
        queryKey:
            [
                `${id}statusBarData-${numberOfDataPointsInStatusBar}`,
            ]
    })
    queryClient.refetchQueries({
        queryKey:
            [
                `${id}statusBarDataDetailed-${numberOfDataPointsInGraph}`
            ]
    })
}

function MonitorDetail() {
    useAxiosWithAuth();
    const queryClient = useQueryClient()
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
    if (error && error instanceof Error) {
        if ('status' in error && error.status === 404)
            return <h1>404 Not Found</h1>
        return <div>Error occured while fetching data from server {error.message} </div>
    }
    if (!monitor) {
        return <div>Error occured</div>
    }


    return <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" flexWrap="wrap">
        <Box
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
                <Button variant="outlined" color="error" onClick={() => deleteHistory(queryClient, monitor.id)}>Delete history</Button>
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
        </Box >
        <MonitorResponseTimeGraph monitor_id={parseInt(monitor_id)} numberOfDataPoints={numberOfDataPointsInGraph} refetchInterval={monitor.time_interval} />
    </Box>
}


export default MonitorDetail;