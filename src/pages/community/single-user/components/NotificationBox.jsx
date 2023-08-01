import { useInfiniteQuery } from '@tanstack/react-query';
import {
    query,
    collection,
    orderBy,
    limit,
    startAfter,
    getDocs,
    where,
} from 'firebase/firestore';
import { db } from '../../../../firebase';
import Notification from './Notification';
import HiddenLoader from '../../../../components/HiddenLoader';
import './NotificationBox.scss';

function NotificationBox({ userId }) {
    const {
        data: pages,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        isLoading,
    } = useInfiniteQuery(['notifications'], getNextPage, {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        getNextPageParam: lastPage => {
            return lastPage.lastVisibleDoc;
        },
    });

    async function getNextPage({ pageParam }) {
        let usersQuery = query(
            collection(db, 'notifications'),
            where('receiverId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(6)
        );

        if (pageParam) {
            const { createdAt } = pageParam;
            if (createdAt) pageParam = createdAt;
            usersQuery = query(usersQuery, startAfter(pageParam));
        }

        const snapshot = await getDocs(usersQuery);
        const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

        const data = await Promise.all(
            snapshot.docs.map(async doc => {
                return { id: doc.id, ...doc.data() };
            })
        );

        if (data.length < 6) return { data, lastVisibleDoc: undefined };

        return { data, lastVisibleDoc };
    }

    console.log(pages);

    const items = pages?.pages.flatMap(page => page.data) || [];

    return (
        <section id="notifications">
            <h2>notifications</h2>
            <section id="notification-box">
                {items.map(notification => (
                    <Notification
                        key={notification.id}
                        notification={notification}
                    />
                ))}

                {(isLoading || isFetchingNextPage) &&
                    Array(4)
                        .fill(0)
                        .map((e, i) => <Notification key={i} />)}
                {hasNextPage && <HiddenLoader loadNextBatch={fetchNextPage} />}
            </section>
        </section>
    );
}

export default NotificationBox;
