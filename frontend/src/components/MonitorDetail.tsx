import { Link, useNavigate, useParams } from "react-router"
import axiosClient from "../axios-client";
import { useMutation, useQuery } from "react-query";
import { Alert, Box, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import Loader from "./Loader";

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

    const deleteMutation = useMutation((_: any): any => {
        return axiosClient.delete(`monitor/${monitor_id}`)
    })

    const navigate = useNavigate()

    if (isLoading) return <Loader />
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
            },
            outline: '1px lightgray solid',
            padding: '1em'
        }}
        marginTop="1em"
        marginLeft="1em">
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
            <h1>
                {monitor?.name}
            </h1>
            <Box>
                <IconButton aria-label="Edit this monitor" component={Link} to={`/monitor/${monitor_id}/edit`}>
                    <Edit/>
                </IconButton>
                <IconButton aria-label="Delete this monitor" onClick={() => {
                    deleteMutation.mutate({}, {
                        onSuccess: (_: any) => {
                            navigate(`/dashboard`)
                        }
                    })
                }}>
                    <Delete />
                </IconButton>
            </Box>
        </Box>
        <p>
            {monitor?.type}
        </p>
        <p>
            {monitor?.url}:{monitor?.port}
        </p>
        {deleteMutation.isLoading ? <Alert severity='info'>Submitting...</Alert> : <></>}
        {deleteMutation.isError ? <Alert severity='error'>Error: {(deleteMutation as any).error.message}</Alert> : <></>}
    </Box>
}


export default MonitorDetail;