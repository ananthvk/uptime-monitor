import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

const LogoutButton = () => {
    const { logout } = useAuth0()

    return <Button color="inherit" variant='contained' onClick={() => logout({
        logoutParams: {
            returnTo: window.location.origin
        }
    })}>Logout</Button>

}

export default LogoutButton;