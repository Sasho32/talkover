import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import './NewPollPage.scss';
import ChooseCategory from '../../posts/new/ChooseCategory';

function getTomorrow() {
    return new Intl.DateTimeFormat('en-CA').format(
        new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
    );
}

function NewPollPage() {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([]);
    const [validUntil, setValidUntil] = useState(getTomorrow());
    const [error, setError] = useState(null);

    const [category, setCategory] = useState(useLocation().state);

    const navigate = useNavigate();

    function addHandler() {
        setOptions(options => [...options, '_#0000FF']);
    }

    function isValidPoll() {
        if (!question) {
            setError(
                'Please let us know what is the question you want to ask.'
            );
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
        if (options.length < 2) {
            setError('You should provide at least 2 options.');
            return;
        }
        const nameSet = new Set(options.map(option => option.split('_')[0]));
        const colorSet = new Set(options.map(option => option.split('_')[1]));
        if (nameSet.size !== options.length) {
            setError('Option names should be unique.');
            return;
        }
        if (colorSet.size !== options.length) {
            setError('Option colors should be unique.');
            return;
        }

        return true;
    }

    async function submitHandler() {
        if (isValidPoll()) {
            await addDoc(collection(db, 'polls'), {
                question,
                options,
                createdAt: serverTimestamp(),
                validUntil: new Date(validUntil),
                votedUsers: [],
                votes: [],
                category,
            });

            //  todo: update stats
            navigate('/home/polls');
        }
    }

    console.log(options);

    return (
        <section id="create-poll">
            <ChooseCategory
                category={category}
                setCategory={setCategory}
                type="poll"
            />
            <div className="topic">
                <label htmlFor="topic">What's the poll about?</label>
                <input
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    id="topic"
                    type="text"
                    required
                />
            </div>
            <div className="options">
                {options.map((option, index) => {
                    const [name, color] = option.split('_');

                    return (
                        <div key={index} className="option">
                            <input
                                value={name}
                                onChange={e => {
                                    setOptions(options => {
                                        options[index] =
                                            e.target.value + '_' + color;
                                        return [...options];
                                    });
                                }}
                                type="text"
                                placeholder="Name"
                            />
                            <input
                                value={color}
                                onChange={e => {
                                    setOptions(options => {
                                        options[index] =
                                            name + '_' + e.target.value;
                                        return [...options];
                                    });
                                }}
                                type="color"
                            />
                        </div>
                    );
                })}
            </div>

            {options.length < 7 ? (
                <button onClick={addHandler} className="add">
                    <span>+</span> Add option
                </button>
            ) : (
                <span>You've reached the maximal number of options.</span>
            )}
            <div className="expiration">
                <label htmlFor="expiration">Expiration date: </label>
                <input
                    value={validUntil}
                    onChange={e => {
                        setValidUntil(e.target.value);
                    }}
                    type="date"
                    id="expiration"
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>
            <button onClick={submitHandler} className="submit">
                Submit poll!
            </button>
            {error && <span>{error}</span>}
        </section>
    );
}

export default NewPollPage;
