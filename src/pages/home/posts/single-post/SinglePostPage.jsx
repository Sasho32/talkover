import { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../../contexts/UserContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { calculateRelativeTime } from '../../../../utils/relative-time';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';
import './SinglePostPage.scss';

function SinglePostPage() {
    const [showComments, setShowComments] = useState(false);
    const { userRecord } = useContext(UserContext);

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
            const post = documentReceived.data();

            if (!post) return null;

            return post;
        },
        {
            refetchOnWindowFocus: false,
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
                            <div className="profile-pic-cutter">
                                <img src="./jesse.jpg" alt="profile" />
                            </div>
                            <h2 data-title="user">Jesse Pinkman</h2>
                        </div>
                        <div className="options">
                            {userRecord?.role === 'moderator' && (
                                <>
                                    <i
                                        style={{ color: 'crimson' }}
                                        className="fa-solid fa-lock"
                                    ></i>
                                    <i
                                        style={{ color: 'yellowgreen' }}
                                        className="fa-solid fa-lock-open"
                                    ></i>
                                </>
                            )}
                        </div>
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
                                <i className="fa-regular fa-thumbs-up"></i>
                                <span>{post.likes.length}</span>
                            </div>
                            <div className="interaction">
                                <i className="fa-regular fa-thumbs-down"></i>
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
                        <div className="comments">
                            <h1>Comments</h1>
                        </div>
                    </div>
                </section>
            </article>
        </section>
    );
}

export default SinglePostPage;
