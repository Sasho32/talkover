import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

function ModRoute() {
    const { userRecord } = useContext(UserContext);

    if (!userRecord) return null;

    return userRecord.role === 'moderator' ? <Outlet /> : <Navigate to="/" />;
}

export default ModRoute;
