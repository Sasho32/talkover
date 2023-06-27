import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { Outlet, Navigate } from 'react-router-dom';

function AuthRoute() {
    const { user } = useContext(UserContext);
    if (user === 'initial') return null;
    return user ? <Outlet /> : <Navigate to="/auth" />;
}

export default AuthRoute;
