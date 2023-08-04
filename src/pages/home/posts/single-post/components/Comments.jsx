import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import {
    query,
    collection,
    orderBy,
    limit,
    startAfter,
    getDocs,
    where,
    doc,
    updateDoc,
    addDoc,
    arrayUnion,
    serverTimestamp,
} from 'firebase/firestore';
import { useRef } from 'react';
import { db } from '../../../../../firebase';
import Comment from './Comment';
import LeaveAReply from './LeaveAReply';

function Comments({ locked, showComments, postId, postAuthor, userId }) {
    const replyRef = useRef(null);

    const {
        data: pages,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        isLoading,
    } = useInfiniteQuery(['comments', postId], getNextPage, {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        getNextPageParam: lastPage => {
            return lastPage.lastVisibleDoc;
        },
        enabled: !!showComments,
    });

    const { mutate: postComment } = useMutation(
        async comment => {
            const commentRef = await addDoc(
                collection(db, 'comments'),
                comment
            );

            const postRef = doc(db, 'posts', postId);

            await updateDoc(postRef, { comments: arrayUnion(commentRef.id) });

            const userRef = doc(db, 'users', userId);

            await updateDoc(userRef, { comments: arrayUnion(commentRef.id) });

            if (comment.replyOn) {
                const notificationRef = await addDoc(
                    collection(db, 'notifications'),
                    {
                        type: 'mentioned',
                        senderId: userId,
                        receiverId: comment.replyOn.authorId,
                        read: false,
                        postId,
                        createdAt: serverTimestamp(),
                    }
                );
            }
        },
        {
            onSuccess: () => {},
        }
    );
    const { mutate: updateComment } = useMutation(
        async comment => {
            const commentRef = doc(db, 'comments', comment.id);

            await updateDoc(commentRef, { content: comment.content });
        },
        {
            onSuccess: () => {},
        }
    );

    async function getNextPage({ pageParam }) {
        console.log('fetching');
        let commentsQuery = query(
            collection(db, 'comments'),
            where('postId', '==', postId),
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

    const items = pages?.pages.flatMap(page => page.data) || [];

    return (
        <div className="comments">
            {/* <h1>Comments</h1> */}
            {!locked && (
                <LeaveAReply
                    ref={replyRef}
                    isCommented={!!items.length}
                    postComment={postComment}
                    updateComment={updateComment}
                    postId={postId}
                />
            )}
            <section id="comments">
                {items.map(comment => (
                    <Comment
                        locked={locked}
                        setReplyingOn={replyRef?.current?.setReplyingOn}
                        edit={replyRef?.current?.edit}
                        comment={comment}
                        key={comment.id}
                    />
                ))}
                {(isLoading || isFetchingNextPage) &&
                    Array(6)
                        .fill(0)
                        .map((e, i) => <Comment key={i} />)}
                {hasNextPage && (
                    <span onClick={fetchNextPage}>Load more...</span>
                )}
            </section>
        </div>
    );
}

export default Comments;
