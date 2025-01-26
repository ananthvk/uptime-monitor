import { Alert, Box, Button, MenuItem, Paper, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import axiosClient from '../axios-client';
import { useNavigate, useParams } from 'react-router';
import Loader from './Loader';
import { methods, Monitor } from '../types';


const retrieveMonitorDetail = async (id: string): Promise<Monitor> => {
    const response = await axiosClient.get(`monitor/${id}`);
    return response.data as Monitor
}

function EditMonitor({ isEdit }: { isEdit: boolean }) {

    const { monitor_id } = useParams<{ monitor_id: string }>()

    const mutation = useMutation((newMonitor: any): any => {
        if (isEdit) {
            return axiosClient.patch(`monitor/${monitor_id}`, newMonitor)
        } else {
            return axiosClient.post('monitor', newMonitor)
        }
    })

    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [type, setType] = useState("HTTP")
    const [url, setUrl] = useState("")
    const [port, setPort] = useState("80")
    const [method, setMethod] = useState("GET")
    const [time_interval, setTimeInterval] = useState(5)

    if (isEdit) {
        const {
            data: serverState,
            error,
            isLoading
        } = useQuery(
            ['monitorData', monitor_id],
            () => { return retrieveMonitorDetail(monitor_id!) },
            { enabled: !!monitor_id }
        )

        useEffect(() => {
            if (isEdit && serverState) {
                setName(serverState?.name)
                setType(serverState?.type)
                setUrl(serverState?.url)
                setPort(serverState?.port.toString())
                setMethod(serverState?.method)
                setTimeInterval(serverState?.time_interval)
            }
        }, [serverState])

        if (isLoading)
            return <Loader />
        if (error) {
            if ((error as any).status === 404)
                return <h1>404 Not Found</h1>
            return <div>Error occured while fetching data from server {(error as any).message} </div>
        }
    }


    return <Box display="flex" alignContent="center" justifyContent="center" marginTop="5em">
        <Paper elevation={3} sx={{
            padding: '1em'
            , width: {
                xs: '90%',
                sm: '80%',
                md: '50%',
                lg: '40%',
                xl: '30%'
            }
        }}>
            {
                isEdit
                    ? <h1>Edit Monitor "{name}"</h1>
                    : <h1>New Monitor</h1>
            }
            <form>
                <Box display="flex" alignContent="center" justifyContent="center" flexDirection="column" gap={3}>
                    <TextField required label="Monitor name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
                    <Select variant='outlined' label="Type" value={type} onChange={(e) => setType(e.target.value)}>
                        <MenuItem value={"HTTP"}>HTTP</MenuItem>
                        <MenuItem value={"TCP"}>TCP</MenuItem>
                    </Select>
                    <TextField required label="URL" variant="outlined" value={url} onChange={(e) => setUrl(e.target.value)} />
                    {
                        type === "TCP"
                            ? <TextField type="number" label="Port" variant="outlined" value={port} onChange={(e) => setPort(e.target.value.toString())} />
                            : <></>
                    }
                    {
                        type === "HTTP" ?
                            <Select variant='outlined' label="Type" value={method} onChange={(e) => setMethod(e.target.value)}>
                                {
                                    methods.map((method) => <MenuItem value={method} key={method}>{method}</MenuItem>)
                                }
                            </Select>
                            : <></>
                    }
                    <TextField type="number" label="Time interval (in seconds)" variant="outlined" value={time_interval} onChange={(e) => setTimeInterval(parseInt(e.target.value))} />
                    <Button variant="contained" onClick={() => {
                        // TODO: Validation
                        mutation.mutate({
                            name,
                            type,
                            url,
                            port,
                            method,
                            time_interval
                        }, {
                            onSuccess: (data: any) => {
                                navigate(`/monitor/${data.data.id}`)
                            }
                        })
                    }}>Save</Button>
                    {mutation.isLoading ? <Alert severity='info'>Saving...</Alert> : <></>}
                    {mutation.isError ? <Alert severity='error'>Error: {(mutation as any).error.message}</Alert> : <></>}
                </Box>
            </form>
        </Paper>
    </Box>
}

export default EditMonitor;