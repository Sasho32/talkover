import './Greeting.scss';

function Greeting({ goToProfile, username, role }) {
    return (
        <div id="greeting">
            <p>
                Hey, <span onClick={goToProfile}>{username}</span>!
            </p>
            <span className="role">{role}</span>
        </div>
    );
}

export default Greeting;
