import { useState } from 'react';
import Banners from './components/Banners';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../UserContext';
import './components/Forms.scss';

function AuthPage() {
    const { user } = useContext(UserContext);
    const [mode, setMode] = useState('sign-in');

    function getSignIn() {
        setMode('sign-in');
    }
    function getSignUp() {
        setMode('sign-up');
    }

    // без ресет на формите - струва ми се по user friendly

    return (
        <main className={`guest ${mode}-mode`}>
            {/* main-а няма да го местя като shared, защото guest/user мога да ги контролираме през user ?, но мода на auth-а e тука */}
            <Banners getSignIn={getSignIn} getSignUp={getSignUp} />
            <div className="forms-container">
                <SignInForm />
                <SignUpForm />
            </div>
        </main>
    );
}

export default AuthPage;
