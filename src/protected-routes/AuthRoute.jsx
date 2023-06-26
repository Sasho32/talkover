import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { Outlet, Navigate } from 'react-router-dom';

function AuthRoute() {
    const user = useContext(UserContext);
    return user ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default AuthRoute;
