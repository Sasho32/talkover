import { serverTimestamp } from 'firebase/firestore';
import { forwardRef, useRef } from 'react';
import { useImperativeHandle } from 'react';
import { useContext, useState } from 'react';
import ProfilePicCutter from '../../../../../components/ProfilePicCutter';
import { UserContext } from '../../../../../contexts/UserContext';

function LeaveAReply({ isCommented, postComment, updateComment, postId }, ref) {
    const { userRecord } = useContext(UserContext);
    const [replyingOn, setReplyingOn] = useState(null);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);

    useImperativeHandle(
        ref,
        () => ({
            edit: (id, content) => {
                commentRef.current.textContent = content;
                setEditing(id);
            },
            setReplyingOn,
        }),
        []
    );

    const commentRef = useRef(null);

    function submitCommentHandler() {
        const { textContent: content } = commentRef.current;

        if (!content || content.length > 500)
            return setError(
                "Comment's content should be between 1 and 500 characters."
            );

        if (editing) {
            // console.log('editing');
            // console.log(editing);
            updateComment({
                content,
                id: editing,
            });
        } else {
            postComment({
                createdAt: serverTimestamp(),
                postId,
                authorId: userRecord.uid,
                content,
                replyOn: replyingOn || false,
            });
        }

        commentRef.current.textContent = '';
        setReplyingOn(null);
        setEditing(false);
        setError(null);
    }

    return (
        <section id="leave-a-reply">
            <div className="comments-header">
                <ProfilePicCutter user={userRecord} />
            </div>
            {/*  */}
            {replyingOn && (
                <section className="reply-on">
                    <i
                        onClick={() => setReplyingOn(null)}
                        className="fa-solid fa-circle-xmark"
                    ></i>
                    Replying on{' '}
                    <span className="author">{replyingOn.author}</span>
                    's: <span className="content">"{replyingOn.content}"</span>
                </section>
            )}
            {editing && (
                <i
                    onClick={() => {
                        commentRef.current.textContent = '';
                        setEditing(null);
                    }}
                    className="fa-solid fa-circle-xmark"
                ></i>
            )}
            <div
                ref={commentRef}
                contentEditable
                data-placeholder={
                    isCommented
                        ? `Leave a reply, ${userRecord?.username}!`
                        : `Be the first to comment, ${userRecord?.username}!`
                }
            ></div>
            {error && (
                <span style={{ background: 'pink', color: 'red' }}>
                    {error}
                </span>
            )}
            <button onClick={submitCommentHandler}>
                {editing ? 'Edit' : 'Post'} comment!
            </button>
        </section>
    );
}

export default forwardRef(LeaveAReply);

{
    /* <section id="emojis">
        <i className="fa-regular fa-face-smile"></i>
        <section className="hidden">
            <span>&#128515;</span>
            <span>&#129315;</span>
            <span>&#128521;</span>
            <span>&#128525;</span>
            <span>&#129300;</span>
            <span>&#129320;</span>
            <span>&#128526;</span>
            <span>&#128549;</span>
            <span>&#128558;</span>
            <span>&#128512;</span>
            <span>&#129315;</span>
            <span>&#128515;</span>
            <span>&#128516;</span>
            <span>&#128513;</span>
            <span>&#128518;</span>
            <span>&#128517;</span>
            <span>&#128514;</span>
            <span>&#128578;</span>
            <span>&#128579;</span>
            <span>&#128521;</span>
            <span>&#128522;</span>
            <span>&#128519;</span>
            <span>&#129392;</span>
            <span>&#128525;</span>
            <span>&#129321;</span>
            <span>&#128536;</span>
            <span>&#128535;</span>
            <span>&#128538;</span>
            <span>&#128537;</span>
            <span>&#128523;</span>
            <span>&#128539;</span>
            <span>&#128540;</span>
            <span>&#129322;</span>
            <span>&#128541;</span>
            <span>&#129297;</span>
            <span>&#129303;</span>
            <span>&#129325;</span>
            <span>&#129323;</span>
            <span>&#129300;</span>
            <span>&#129296;</span>
            <span>&#129320;</span>
            <span>&#128528;</span>
            <span>&#128529;</span>
            <span>&#128566;</span>
            <span>&#128527;</span>
            <span>&#128530;</span>
            <span>&#128580;</span>
            <span>&#128556;</span>
            <span>&#129317;</span>
            <span>&#128524;</span>
            <span>&#128532;</span>
            <span>&#128554;</span>
            <span>&#129316;</span>
            <span>&#128564;</span>
            <span>&#128567;</span>
            <span>&#129298;</span>
        </section>
    </section> */
}
