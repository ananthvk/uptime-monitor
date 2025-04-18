import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0()
    return <Button color="inherit" variant='contained' onClick={() => loginWithRedirect()}>Login</Button>
}
export default LoginButton;