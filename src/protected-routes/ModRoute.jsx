import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Outlet, Navigate } from 'react-router-dom';
import { getUserRecord } from '../utils/user';

function ModRoute() {
    const user = useContext(UserContext);
    const userRecord = getUserRecord(user.uid);

    return userRecord.role === 'moderator' ? <Outlet /> : <Navigate to="/" />;
}

export default ModRoute;
