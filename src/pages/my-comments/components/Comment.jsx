import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useState } from 'react';
import { db } from '../../../firebase';
import { capitalizeFirstLetter } from '../../../utils/user';
import { firebaseTimestampToHour } from '../../../utils/time';
import './Comment.scss';

function Comment({ myUsername, comment }) {
    const [post, setPost] = useState(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    useEffect(() => {
        if (!comment) return;
        const post = queryClient.getQueryData(['posts', comment.postId]);
        console.log(post);
        if (post) return setPost(post);

        const postRef = doc(db, 'posts', comment.postId);
        getDoc(postRef).then(postReceived =>
            setPost({ id: postReceived.id, ...postReceived.data() })
        );
    }, []);

    if (!comment || !post)
        return <article className="comment skeleton"></article>;

    return (
        <article
            onClick={() => navigate(`/home/posts/${post.id}`)}
            className="comment"
        >
            <img
                style={{ width: '100px', borderRadius: '1rem' }}
                src={post.url}
                alt="post-image"
            />
            <div className="info">
                <span>
                    <span>{myUsername}</span> commented on{' '}
                    <span>"{post.heading}"</span>:
                </span>
                <span className="comment">{comment.content}</span>
                <div className="category-time">
                    <div
                        onClick={e => {
                            e.stopPropagation();
                            navigate(
                                `/home/posts?category=${post.category}&filteredBy=published`
                            );
                        }}
                        className="category"
                    >
                        <i className="fa-solid fa-volleyball"></i>
                        <span>{capitalizeFirstLetter(post.category)}</span>
                    </div>
                    <div className="time">
                        <i className="fa-regular fa-clock"></i>
                        <span>
                            {firebaseTimestampToHour(comment.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default Comment;
