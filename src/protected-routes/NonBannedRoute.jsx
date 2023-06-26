import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { Outlet, Navigate } from 'react-router-dom';
import { getUserRecord } from '../utils/user';

function NonBannedRoute() {
    const user = useContext(UserContext);
    const userRecord = getUserRecord(user.uid);

    return userRecord.intruder !== 'banned' ? <Outlet /> : <Navigate to="/" />;
}

export default NonBannedRoute;
