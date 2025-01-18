import { useParams } from "react-router"
import axiosClient from "../axios-client";
import { useQuery } from "react-query";

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

    return <div>
        <h1>
            {monitor?.name}
        </h1>
        <p>
            {monitor?.type}
        </p>
        <p>
            {monitor?.url}:{monitor?.port}
        </p>
    </div>
}


export default MonitorDetail;