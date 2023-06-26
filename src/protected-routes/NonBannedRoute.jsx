import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { Outlet, Navigate } from 'react-router-dom';

function NonBannedRoute() {
    const { userRecord } = useContext(UserContext);

    return userRecord.intruder !== 'banned' ? <Outlet /> : <Navigate to="/" />;
}

export default NonBannedRoute;
