import { useParams } from "react-router"
import axiosClient from "../axios-client";
import { useQuery } from "react-query";
import { Box, Button } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

type Monitor = { id: string, name: string, url: string, port: string, type: string }

const retrieveMonitorDetail = async (id: string): Promise<Monitor> => {
    const response = await axiosClient.get(`monitor/${id}`);
    return response.data as Monitor
}

function MonitorDetail() {
    const { monitor_id } = useParams<{ monitor_id: string }>()
    const {
        data: monitor,
        error,
        isLoading
    } = useQuery(
        ['monitorData', monitor_id],
        () => { return retrieveMonitorDetail(monitor_id!) },
        { enabled: !!monitor_id }
    )

    if (isLoading) return <div>Loading...</div>;
    if (error) {
        if ((error as any).status === 404)
            return <h1>404 Not Found</h1>
        return <div>Error occured while fetching data from server {(error as any).message} </div>
    }

    return <Box
        sx={{
            width: {
                xs: '90%',
                sm: '80%',
                md: '50%',
                lg: '40%',
                xl: '30%'
            }
        }}
        marginLeft="1em">
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
            <h1>
                {monitor?.name}
            </h1>
            <Box>
                <Button>
                    <Edit />
                </Button>
                <Button>
                    <Delete />
                </Button>
            </Box>
        </Box>
        <p>
            {monitor?.type}
        </p>
        <p>
            {monitor?.url}:{monitor?.port}
        </p>
    </Box>
}


export default MonitorDetail;