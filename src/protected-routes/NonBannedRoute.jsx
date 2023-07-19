import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

function NonBannedRoute() {
    const { userRecord } = useContext(UserContext);

    if (!userRecord) return null;

    return userRecord.intruder !== 'banned' ? <Outlet /> : <Navigate to="/" />;
}

export default NonBannedRoute;
