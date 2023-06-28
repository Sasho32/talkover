import Logo from './Logo';

function Banners({ getSignIn, getSignUp }) {
    return (
        <>
            <div className="left-upper-banner banner">
                <Logo />
                <div className="content">
                    <h2>New here?</h2>
                    <button onClick={getSignUp} id="sign-up-btn">
                        Sign up!
                    </button>
                </div>
            </div>
            <div className="right-lower-banner banner">
                <Logo />
                <div className="content">
                    <h2>Already one of us?</h2>
                    <button onClick={getSignIn} id="sign-in-btn">
                        Sign in!
                    </button>
                </div>
            </div>
        </>
    );
}

export default Banners;
