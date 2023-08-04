import { useState, useContext, Profiler } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../../contexts/UserContext';
import { doc, getDoc, increment, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { calculateRelativeTime } from '../../../../utils/relative-time';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';
import ProfilePicCutter from '../../../../components/ProfilePicCutter';
import './SinglePostPage.scss';
import { useEffect } from 'react';
import Comments from './components/Comments';

function SinglePostPage() {
    const [showComments, setShowComments] = useState(false);
    const { userRecord } = useContext(UserContext);

    const [author, setAuthor] = useState(null);
    const queryClient = useQueryClient();

    let { postId } = useParams();

    const {
        isLoading,
        isError,
        data: post,
    } = useQuery(
        ['posts', postId],
        async () => {
            const docRef = doc(db, 'posts', postId);
            const documentReceived = await getDoc(docRef);
            const post = {
                ...documentReceived.data(),
                id: documentReceived.id,
            };

            if (!post) return null;

            if (post.author !== userRecord.uid) {
                // updateViews();
            }

            const authorCache = queryClient.getQueryData([
                'users',
                post.author,
            ]);

            if (authorCache) {
                setAuthor(authorCache);
            } else {
                const authorRef = doc(db, 'users', post.author);
                const authorReceived = await getDoc(authorRef);
                setAuthor(authorReceived.data());
            }
            // ако трябва да го фетчваме -> значи няма кеш -> няма да го ъпдейтваме/сетваме, защото така или иначе искам да фетчва usera при всеки hit на community/:userId

            return post;
        },
        {
            refetchOnWindowFocus: false,
            enabled: !!userRecord,
        }
    );

    const { mutate: updateViews } = useMutation(
        async () => {
            console.log('updating views');

            const postRef = doc(db, 'posts', postId);

            await updateDoc(postRef, { views: increment(1) });
        },
        {
            onSuccess: () => {
                queryClient.setQueryData(['posts', postId], post => ({
                    ...post,
                    views: post.views + 1,
                }));
            },
        }
    );

    async function likeHandler() {
        // is author
        if (userRecord.uid === post.author) return;
        // hasLiked
        if (post.likes.includes(userRecord.uid)) {
            const postRef = doc(db, 'posts', postId);

            await updateDoc(postRef, {
                likes: post.likes.filter(likerId => likerId !== userRecord.uid),
            });

            queryClient.setQueryData(['posts', postId], post => ({
                ...post,
                likes: post.likes.filter(likerId => likerId !== userRecord.uid),
            }));

            return;
        }
        // hasNotLiked
        const postRef = doc(db, 'posts', postId);

        if (post.dislikes.includes(userRecord.uid)) {
            await updateDoc(postRef, {
                dislikes: post.dislikes.filter(
                    disliker => disliker !== userRecord.uid
                ),
            });
            queryClient.setQueryData(['posts', postId], post => ({
                ...post,
                dislikes: post.dislikes.filter(
                    disliker => disliker !== userRecord.uid
                ),
            }));
        }

        await updateDoc(postRef, {
            likes: [...post.likes, userRecord.uid],
        });

        queryClient.setQueryData(['posts', postId], post => ({
            ...post,
            likes: [...post.likes, userRecord.uid],
        }));
    }

    async function dislikeHandler() {
        // is author
        if (userRecord.uid === post.author) return;
        // hasDisliked
        if (post.dislikes.includes(userRecord.uid)) {
            const postRef = doc(db, 'posts', postId);

            await updateDoc(postRef, {
                dislikes: post.dislikes.filter(
                    dislikerId => dislikerId !== userRecord.uid
                ),
            });
            queryClient.setQueryData(['posts', postId], post => ({
                ...post,
                dislikes: post.dislikes.filter(
                    dislikerId => dislikerId !== userRecord.uid
                ),
            }));
            return;
        }
        // hasNotDisliked
        const postRef = doc(db, 'posts', postId);

        console.log('predi da mahne like');

        if (post.likes.includes(userRecord.uid)) {
            console.log('vytre');
            console.log(
                post.likes.filter(likerId => likerId !== userRecord.uid)
            );
            await updateDoc(postRef, {
                likes: post.likes.filter(likerId => likerId !== userRecord.uid),
            });
            queryClient.setQueryData(['posts', postId], post => ({
                ...post,
                likes: post.likes.filter(likerId => likerId !== userRecord.uid),
            }));
        }

        console.log('sled kato mahne like');

        console.log([...post.dislikes, userRecord.uid]);

        await updateDoc(postRef, {
            dislikes: [...post.dislikes, userRecord.uid],
        });

        queryClient.setQueryData(['posts', postId], post => ({
            ...post,
            dislikes: [...post.dislikes, userRecord.uid],
        }));
    }

    const { mutate: lockPost } = useMutation(
        async post => {
            console.log(post);
            const postRef = doc(db, 'posts', post.id);

            await updateDoc(postRef, { locked: true });
        },
        {
            onSuccess: () => {},
        }
    );
    const { mutate: unlockPost } = useMutation(
        async post => {
            const postRef = doc(db, 'posts', post.id);

            await updateDoc(postRef, { locked: false });
        },
        {
            onSuccess: () => {},
        }
    );

    if (isLoading) {
        return <section id="single-post" className="skeleton"></section>;
    }

    if (isError || !post) {
        return <h2>Post not found or an error occurred.</h2>;
    }

    return (
        <section id="single-post">
            <h1 id="post-heading">{post.heading}</h1>
            <article
                id="post"
                className={`${showComments ? 'comments-mode' : ''}`}
            >
                <section id="content">
                    <div className="header">
                        <div className="author-info">
                            <ProfilePicCutter user={author} />
                            <h2>{author?.username}</h2>
                        </div>
                        {userRecord?.role === 'moderator' && (
                            <div className="options">
                                {post.locked ? (
                                    <i
                                        onClick={() => unlockPost(post)}
                                        style={{ color: 'yellowgreen' }}
                                        className="fa-solid fa-lock-open"
                                    ></i>
                                ) : (
                                    <i
                                        onClick={() => lockPost(post)}
                                        style={{ color: 'crimson' }}
                                        className="fa-solid fa-lock"
                                    ></i>
                                )}
                            </div>
                        )}
                    </div>

                    <img src={post.url} alt="blog-img" className="image" />

                    <div className="stats">
                        <div className="interactions">
                            <div
                                className="interaction"
                                onClick={() => setShowComments(false)}
                            >
                                <i className="fa-regular fa-eye"></i>
                                <span>{post.views}</span>
                            </div>
                            <div className="interaction">
                                <i
                                    onClick={likeHandler}
                                    className={`fa-${
                                        post.likes.includes(userRecord.uid)
                                            ? 'solid'
                                            : 'regular'
                                    } fa-thumbs-up`}
                                ></i>
                                <span>{post.likes.length}</span>
                            </div>
                            <div className="interaction">
                                <i
                                    onClick={dislikeHandler}
                                    className={`fa-${
                                        post.dislikes.includes(userRecord.uid)
                                            ? 'solid'
                                            : 'regular'
                                    } fa-thumbs-down`}
                                ></i>
                                <span>{post.dislikes.length}</span>
                            </div>

                            <div
                                className="interaction"
                                onClick={() => setShowComments(true)}
                            >
                                <i className="fa-regular fa-comment"></i>
                                <span>{post.comments.length}</span>
                            </div>
                        </div>
                        <div className="timestamp">
                            <span className="date">
                                {calculateRelativeTime(post.publishedOn)}
                            </span>
                        </div>
                    </div>
                    <div className="main-content">
                        <div className="post">
                            <section id="info">
                                <div className="ql-snow">
                                    <div
                                        className="ql-editor"
                                        id="quill-value"
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                post.content
                                            ),
                                        }}
                                    ></div>
                                </div>
                            </section>
                        </div>
                        <Comments
                            locked={
                                !!post.locked ||
                                userRecord?.intruder === 'banned'
                            }
                            showComments={showComments}
                            postId={postId}
                            postAuthor={post.author}
                            userId={userRecord?.uid}
                        />
                    </div>
                </section>
            </article>
        </section>
    );
}

export default SinglePostPage;
