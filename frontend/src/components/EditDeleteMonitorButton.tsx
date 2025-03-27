import { Link, useNavigate } from "react-router";
import axiosClient, { useAxiosWithAuth } from "../axios-client";
import { useMutation } from "react-query";
import { Alert, Box, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

function EditDeleteMonitorButton({ monitor_id }: { monitor_id: string }) {
    useAxiosWithAuth();
    const deleteMutation = useMutation((_: any): any => {
        return axiosClient.delete(`monitor/${monitor_id}`)
    })

    const navigate = useNavigate()

    if (deleteMutation.isLoading)
        return <Alert severity='info'>Submitting...</Alert>
    if (deleteMutation.isError)
        return <Alert severity='error'>Error: {(deleteMutation as any).error.message}</Alert>

    return < Box >
        <IconButton aria-label="Edit this monitor" component={Link} to={`/monitor/${monitor_id}/edit`}>
            <Edit />
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
    </Box >
}
export default EditDeleteMonitorButton;