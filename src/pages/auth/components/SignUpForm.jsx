import { extractAuthErrorMessage, signUp } from '../../../utils/user';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './SignUpForm.scss';

function SignUpForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const navigate = useNavigate();

    function resetForm() {
        setUsername('');
        setPassword('');
        setError(null);
        setPasswordVisibility(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await signUp({
                username,
                password,
            });

            navigate('/posts');
        } catch (e) {
            setError(extractAuthErrorMessage(e));
        }
    }

    return (
        <form onSubmit={handleSubmit} id="sign-up-form">
            <h2 className="title">Join us!</h2>

            <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    type="text"
                    placeholder="Username"
                />
            </div>

            <div className="input-field">
                <i className="fas fa-lock"></i>
                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type={passwordVisibility ? 'text' : 'password'}
                    placeholder="Password"
                />
                <i
                    onClick={() => setPasswordVisibility(pv => !pv)}
                    className={`fa-solid fa-eye${
                        passwordVisibility ? '-slash' : ''
                    }`}
                ></i>
            </div>

            <input type="submit" value="Sign up" className="btn solid" />

            {error && <span className="error">{error}</span>}
        </form>
    );
}

export default SignUpForm;
