import './SingleUserPage.scss';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import UserCard from './components/UserCard';
import NotificationBox from '../components/NotificationBox';
import { replaceElementInCache } from '../../../utils/react-query-cache';

function SingleUserPage() {
    const queryClient = useQueryClient();

    const { userRecord } = useContext(UserContext);

    let { userId } = useParams();

    const {
        isLoading,
        isError,
        data: user,
        error,
    } = useQuery(
        ['users', userId],
        async () => {
            if (userRecord.uid === userId) return userRecord;

            const docRef = doc(db, 'users', userId);
            const documentReceived = await getDoc(docRef);
            const user = documentReceived.data();

            console.log(user);

            const communityCache = queryClient.getQueryData(['users']);
            if (communityCache)
                replaceElementInCache(user, 'uid', communityCache);

            return user;
        },
        {
            refetchOnWindowFocus: false,
            enabled: !!userRecord,
        }
    );

    if (isLoading) return <UserCard />;
    if (isError) return <h1>Error: {error.message}</h1>;

    return (
        <UserCard
            key={user.uid}
            // за own profile, userRecord е null в началото
            queryClient={queryClient}
            me={userRecord}
            user={user}
        />
    );
}

export default SingleUserPage;
