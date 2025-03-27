import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, Tooltip } from "@mui/material";

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    return (
        isAuthenticated && (
            <div>
                <Tooltip title={user?.name}>
                    <Avatar alt={user?.name} src={user?.picture} />
                </Tooltip>
            </div>
        )
    );
};

export default Profile;