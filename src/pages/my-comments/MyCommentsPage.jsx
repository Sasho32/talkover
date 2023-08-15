import React, { useContext } from 'react';
import Comment from './components/Comment';
import { UserContext } from '../../contexts/UserContext';
import './MyCommentsPage.scss';
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
import { db } from '../../firebase';
import { formatDateFromFirebaseTimestamp } from '../../utils/time';

function MyCommentsPage() {
    const { userRecord } = useContext(UserContext);

    const {
        data: pages,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        isLoading,
    } = useInfiniteQuery(['my-comments'], getNextPage, {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        cacheTime: Infinity,
        getNextPageParam: lastPage => {
            return lastPage.lastVisibleDoc;
        },
        enabled: !!userRecord,
    });

    async function getNextPage({ pageParam }) {
        let commentsQuery = query(
            collection(db, 'comments'),
            where('authorId', '==', userRecord.uid),
            orderBy('createdAt', 'desc'),
            limit(6)
        );

        if (pageParam) {
            const { createdAt } = pageParam;
            if (createdAt) pageParam = createdAt;
            commentsQuery = query(commentsQuery, startAfter(pageParam));
        }

        const snapshot = await getDocs(commentsQuery);
        const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

        const data = await Promise.all(
            snapshot.docs.map(async doc => {
                return {
                    ...doc.data(),
                    id: doc.id,
                };
            })
        );

        if (data.length < 5) return { data, lastVisibleDoc: undefined };

        return { data, lastVisibleDoc };
    }

    const comments = pages?.pages.flatMap(page => page.data) || [];

    return (
        <section id="comments">
            <h2>My comments</h2>
            {comments.map((comment, index) => {
                return (
                    <React.Fragment key={comment.id}>
                        {isLatestOfDate(comments[index - 1], comment) && (
                            <h3 className="delimeter">
                                {formatDateFromFirebaseTimestamp(
                                    comment.createdAt
                                )}
                            </h3>
                        )}
                        <Comment
                            comment={comment}
                            myUsername={userRecord.username}
                        />
                    </React.Fragment>
                );
            })}
            {(isLoading || isFetchingNextPage) &&
                Array(6)
                    .fill(0)
                    .map((e, i) => <Comment key={i} />)}
            {hasNextPage ? (
                <span onClick={fetchNextPage}>Load more...</span>
            ) : (
                <span>You've read all of your comments.</span>
            )}
        </section>
    );
}

function isLatestOfDate(previous, current) {
    //first document of the collection should get heading;
    if (!previous) return true;

    return (
        formatDateFromFirebaseTimestamp(previous.createdAt) !==
        formatDateFromFirebaseTimestamp(current.createdAt)
    );
}
export default MyCommentsPage;
