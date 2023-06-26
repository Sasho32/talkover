import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { Outlet, Navigate } from 'react-router-dom';

function ModRoute() {
    const { userRecord } = useContext(UserContext);

    return userRecord.role === 'moderator' ? <Outlet /> : <Navigate to="/" />;
}

export default ModRoute;
