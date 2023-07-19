import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

function AuthRoute() {
    const { user } = useContext(UserContext);
    if (user === 'initial') return null;
    return user ? <Outlet /> : <Navigate to="/auth" />;
}

export default AuthRoute;
