import { useState } from 'react';
import Banners from './components/Banners';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import './AuthPage.scss';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../UserContext';

function AuthPage() {
    const { user } = useContext(UserContext);
    const [mode, setMode] = useState('sign-in');

    if (user === 'initial') return;
    if (user?.uid) return <Navigate to="/posts" />;

    function getSignIn() {
        setMode('sign-in');
    }
    function getSignUp() {
        setMode('sign-up');
    }

    // без ресет на формите - струва ми се по user friendly

    return (
        <main className={`${mode}-mode`}>
            <Banners getSignIn={getSignIn} getSignUp={getSignUp} />
            <div className="forms-container">
                <SignInForm />
                <SignUpForm />
            </div>
        </main>
    );
}

export default AuthPage;
