import { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
    query,
    collection,
    orderBy,
    limit,
    startAfter,
    getDocs,
} from 'firebase/firestore';
import { db } from '../../firebase';
import LoadMore from '../../components/LoadMore';
import UserSwiper from './UserSwiper';
import './CommunityPage.scss';

function CommunityPage() {
    const { userRecord } = useContext(UserContext);

    const {
        data: pages,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        isLoading,
    } = useInfiniteQuery(['users'], getNextPage, {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        getNextPageParam: lastPage => {
            return lastPage.lastVisibleDoc;
        },
    });

    async function getNextPage({ pageParam }) {
        let usersQuery = query(
            collection(db, 'users'),
            orderBy('username'),
            limit(5)
        );

        if (pageParam) {
            usersQuery = query(usersQuery, startAfter(pageParam));
        }

        const snapshot = await getDocs(usersQuery);
        const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

        const data = await Promise.all(
            snapshot.docs.map(async doc => {
                return doc.data();
            })
        );

        if (data.length < 5) return { data, lastVisibleDoc: undefined };

        return { data, lastVisibleDoc };
    }

    const items = pages?.pages.flatMap(page => page.data) || [];

    const [activeUser, setActiveUser] = useState(null);

    return (
        <section className="community">
            <h2>community</h2>
            <section id="users">
                <section id="table">
                    {items.map(user => {
                        if (user.uid === userRecord?.uid) user = userRecord;
                        // за да не ъпдейтвам и за него кеша след смяна на профилна, обаче трябва да си го фетчвам, защото няма как да знам къде да се позиционира иначе

                        return (
                            <UserSwiper
                                onClick={() =>
                                    setActiveUser(active => {
                                        return active === user.uid
                                            ? null
                                            : user.uid;
                                    })
                                }
                                key={user.uid}
                                user={user}
                                activeUser={activeUser}
                            />
                        );
                    })}
                    {(isLoading || isFetchingNextPage) &&
                        Array(6)
                            .fill(0)
                            .map((e, i) => <UserSwiper key={i} />)}
                </section>
            </section>
            {hasNextPage && <LoadMore onClick={fetchNextPage} />}
        </section>
    );
}

export default CommunityPage;
