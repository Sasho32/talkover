import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useQueryParams from '../../../../custom-hooks/useQueryParams';
import {
    addDoc,
    collection,
    doc,
    increment,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';
import { db, storage } from '../../../../firebase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import './NewPostPage.scss';
import ChooseCategory from './ChooseCategory';
import { useContext } from 'react';
import { UserContext } from '../../../../contexts/UserContext';
import { handleImageUpload } from '../../../../utils/user';

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link'],
        ['clean'],
    ],
};

const emojis = Array.from(
    new Set([
        '&#128515;',
        '&#129315;',
        '&#128521;',
        '&#128525;',
        '&#129300;',
        '&#129320;',
        '&#128526;',
        '&#128549;',
        '&#128558;',
        '&#128512;',
        '&#129315;',
        '&#128515;',
        '&#128516;',
        '&#128513;',
        '&#128518;',
        '&#128517;',
        '&#128514;',
        '&#128578;',
        '&#128579;',
        '&#128521;',
        '&#128522;',
        '&#128519;',
        '&#129392;',
        '&#128525;',
        '&#129321;',
        '&#128536;',
        '&#128535;',
        '&#128538;',
        '&#128537;',
        '&#128523;',
        '&#128539;',
        '&#128540;',
        '&#129322;',
        '&#128541;',
        '&#129297;',
        '&#129303;',
        '&#129325;',
        '&#129323;',
        '&#129300;',
        '&#129296;',
        '&#129320;',
        '&#128528;',
        '&#128529;',
        '&#128566;',
        '&#128527;',
        '&#128530;',
        '&#128580;',
        '&#128556;',
    ])
);
// не знам дали не се повтаря някое

function NewPostPage() {
    const navigate = useNavigate();
    const { userRecord } = useContext(UserContext);
    const [category, setCategory] = useState(useLocation().state);
    const [heading, setHeading] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [showEmojis, setShowEmojis] = useState(false);
    const [error, setError] = useState(null);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    console.log(content);

    function isValidPost() {
        if (!heading) {
            setError('Please let us know what is the topic of your post.');
            return;
        }
        if (!content) {
            setError('Please provide a content for your post.');
            return;
        }
        if (content.replaceAll(/<.+?>/g, '').length > 6000) {
            setError('Content is too big.');
            return;
        }
        if (
            !['politics', 'life', 'movies', 'music', 'sports'].includes(
                category
            )
        ) {
            setError('Invalid category.');
            return;
        }
        if (!image) {
            setError('You should provide an image.');
            return;
        }

        return true;
    }

    async function submitHandler() {
        if (!isValidPost()) return;

        setLoading(true);

        const postRef = await addDoc(collection(db, 'posts'), {
            author: userRecord.uid,
            category,
            heading,
            content: DOMPurify.sanitize(content),
            comments: [],
            likes: [],
            dislikes: [],
            views: 0,
            approved: userRecord.role === 'moderator',
            publishedOn: serverTimestamp(),
            lastlyCommentedOn: null,
            url: null,
            locked: false,
        });

        const url = await handleImageUpload('post_pics', postRef.id, image);

        console.log(url);
        await updateDoc(postRef, {
            url,
        });

        if (userRecord.role === 'moderator') {
            const statRef = doc(db, 'forum-stats', 'posts');

            await updateDoc(statRef, {
                [category]: increment(1),
            });

            const modRef = doc(db, 'users', userRecord.uid);

            await updateDoc(modRef, {
                posts: increment(1),
            });
        }

        setLoading(false);

        // setOpenSuccess(true);

        //  todo: update stats
        navigate('/home/posts');
    }

    return (
        <section className="create">
            <ChooseCategory category={category} setCategory={setCategory} />
            <div className="topic">
                <label htmlFor="topic">What's the post about?</label>
                <input
                    value={heading}
                    onChange={e => setHeading(e.target.value)}
                    autoComplete="off"
                    id="topic"
                    type="text"
                    required
                />
            </div>
            <input
                onChange={e => setImage(e.target.files[0])}
                type="file"
                name="Photo"
                className="custom-file-input"
            />
            <ReactQuill
                modules={modules}
                theme="snow"
                value={content}
                onChange={setContent}
                placeholder="Content goes here!"
            />
            <span>
                {6000 - content.replaceAll(/<.+?>/g, '').length} characters
                left.
            </span>
            {/* <ReactQuill theme="bubble" value={value} readOnly={true} /> */}
            <section id="emojis">
                <i
                    onClick={() => setShowEmojis(prev => !prev)}
                    className="fa-regular fa-face-smile"
                ></i>
                {showEmojis && (
                    <section className={`hidden`}>
                        {emojis.map(emoji => (
                            <span
                                onClick={e => {
                                    setContent(
                                        content =>
                                            content + e.target.textContent
                                    );
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: emoji,
                                }}
                                key={emoji}
                            ></span>
                        ))}
                    </section>
                )}
            </section>
            <button
                disabled={loading}
                onClick={submitHandler}
                className="submit"
            >
                {`Submit${loading ? 'ing' : ''} post!`}
            </button>
            {error && <span>{error}</span>}
        </section>
    );
}

export default NewPostPage;

{
    /* другият вариант е с bubble темата и readOnly=true 
            https://stackoverflow.com/questions/40952434/how-do-i-display-the-content-of-react-quill-without-the-html-markup#:~:text=Note%3A%20ReactQuill%20comes%20with%20two,themes%20(bubble%20and%20snow).&text=And%20here%20is%20how%20it,to%20display%20your%20editor%20content. */
}

{
    /*  - и двете работят - div-ът е с малко по-различен шрифт или размер нз
            - div-ът работи само ако го wrapnem с друг и сложим съответните класове, но иначе нито overflow-ва хоризонтално на телефон, нито има някоя от опциите да не работи
            https://stackoverflow.com/questions/62777119/binding-html-data-from-quill-editor-is-not-displaying-as-expected-in-angular-2
            - без wrapper div не работи - дори и да добавим ql-snow на inner div-а(не работят blockquote и codeblock)
            - индентацията с tab работи с div-а само - другото работи с допълнителната опция за индентация ако се сложи със стрелките иконката
             */
}
