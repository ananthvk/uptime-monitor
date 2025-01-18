import { Alert, Box, Button, MenuItem, Paper, Select, TextField } from '@mui/material';
import { useState } from 'react';
import { useMutation } from 'react-query';
import axiosClient from '../axios-client';
import { useNavigate } from 'react-router';

function CreateMonitor() {
    const [name, setName] = useState("")
    const [type, setType] = useState("HTTP")
    const [url, setUrl] = useState("")
    const [port, setPort] = useState("80")
    const [method, setMethod] = useState("GET")
    const mutation = useMutation((newMonitor: any): any => {
        return axiosClient.post('monitor', newMonitor)
    })
    const navigate = useNavigate()

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
            <h1>
                Create a new monitor
            </h1>
            <form>
                <Box display="flex" alignContent="center" justifyContent="center" flexDirection="column" gap={3}>
                    <TextField required label="Monitor name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
                    <Select variant='outlined' label="Type" value={type} onChange={(e) => setType(e.target.value)}>
                        <MenuItem value={"HTTP"}>HTTP</MenuItem>
                        <MenuItem value={"TCP"}>TCP</MenuItem>
                    </Select>
                    <TextField required label="URL" variant="outlined" value={url} onChange={(e) => setUrl(e.target.value)} />
                    <TextField type="number" label="Port" variant="outlined" value={port} onChange={(e) => setPort(e.target.value)} />
                    {
                        type === "HTTP" ?
                            <Select variant='outlined' label="Type" value={method} onChange={(e) => setMethod(e.target.value)}>
                                <MenuItem value={"GET"}>GET</MenuItem>
                                <MenuItem value={"HEAD"}>HEAD</MenuItem>
                                <MenuItem value={"OPTIONS"}>OPTIONS</MenuItem>
                                <MenuItem value={"TRACE"}>TRACE</MenuItem>
                                <MenuItem value={"PUT"}>PUT</MenuItem>
                                <MenuItem value={"DELETE"}>DELETE</MenuItem>
                                <MenuItem value={"POST"}>POST</MenuItem>
                                <MenuItem value={"PATCH"}>PATCH</MenuItem>
                                <MenuItem value={"CONNECT"}>CONNECT</MenuItem>
                            </Select>
                            : <></>
                    }
                    <Button variant="contained" onClick={() => {
                        // TODO: Validation
                        mutation.mutate({
                            name,
                            type,
                            url,
                            port,
                            method
                        }, {
                            onSuccess: (data: any) => {
                                navigate(`/monitor/${data.data.id}`)
                            }
                        })
                    }}>Save</Button>
                    {mutation.isLoading ? <Alert severity='info'>Submitting...</Alert> : <></>}
                    {mutation.isError ? <Alert severity='error'>Error: {(mutation as any).error.message}</Alert> : <></>}
                </Box>
            </form>
        </Paper>
    </Box>
}

export default CreateMonitor;