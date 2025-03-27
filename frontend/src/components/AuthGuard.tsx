import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loader from "./Loader";
import { ComponentType, FC } from "react";

// https://stackoverflow.com/questions/71744479/passing-props-to-the-components-of-protectedroute-in-auth0
type AuthGuardProps = {
    component: ComponentType,
    props: any
}

const AuthGuard: FC<AuthGuardProps> = ({ component, props }) => {
    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => (
            <div className="page-layout">
                <Loader />
            </div>
        ),
    });

    return <Component {...props} />;
};

export default AuthGuard;