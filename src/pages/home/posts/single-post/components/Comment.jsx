import { useQueryClient } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import ProfilePicCutter from '../../../../../components/ProfilePicCutter';
import { UserContext } from '../../../../../contexts/UserContext';
import { db } from '../../../../../firebase';
import { calculateRelativeTime } from '../../../../../utils/relative-time';

function Comment({ locked, setReplyingOn, edit, test, comment }) {
    const { userRecord } = useContext(UserContext);
    const [author, setAuthor] = useState(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!comment) return;
        const author = queryClient.getQueryData(['users', comment.authorId]);
        if (author) return setAuthor(author);

        const authorRef = doc(db, 'users', comment.authorId);
        getDoc(authorRef).then(authorReceived =>
            setAuthor(authorReceived.data())
        );
    }, []);

    if (!comment) return <article className="comment skeleton"></article>;

    return (
        <article className="comment">
            <ProfilePicCutter user={author} />
            {/* <div className="commenter-info">
                    <!-- датата седеше тука - затова е див -> оставям то ако реша да сложа още инфо за коментиращия -->
                    <h4>{author?.username}:</h4>
                </div> */}

            <div className="comment">
                <div className="comment-heading">
                    <div className="date">
                        <i className="fa-regular fa-clock"></i>
                        <span>
                            {calculateRelativeTime(comment.createdAt)}{' '}
                            <span className="comment-author">
                                {author?.username}
                            </span>{' '}
                            said:
                        </span>
                    </div>
                    {author?.uid === userRecord?.uid && !locked && (
                        <i
                            onClick={() => {
                                edit(comment.id, comment.content);
                                setReplyingOn(null);
                            }}
                            className="fa-solid fa-pencil"
                        ></i>
                    )}
                    {author?.uid !== userRecord?.uid && !locked && (
                        <i
                            onClick={() => {
                                edit(null, '');
                                setReplyingOn({
                                    authorId: author?.uid,
                                    author: author?.username,
                                    content: comment.content,
                                    id: comment.id,
                                });
                            }}
                            className="fa-solid fa-reply"
                        ></i>
                    )}
                </div>
                {comment.replyOn && (
                    <div id="quote">
                        <h1>{comment.replyOn.author}:</h1>
                        <h3>"{comment.replyOn.content}"</h3>
                    </div>
                )}
                <p>{comment.content}</p>
            </div>
        </article>
    );
}

export default Comment;
