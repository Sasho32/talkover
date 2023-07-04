import './Modes.scss';

function Modes({ mode, switchToPosts, switchToPolls }) {
    return (
        <section className="modes">
            <h2>MODES</h2>
            <div
                className={`${mode === 'posts' ? 'posts-mode' : 'polls-mode'}`}
                id="modes"
            >
                <div onClick={switchToPosts} className="mode">
                    <span>Posts</span>
                    <i className="fa-regular fa-file-lines"></i>
                </div>
                <div onClick={switchToPolls} className="mode">
                    <span>Polls</span>
                    <i className="fa-regular fa-circle-question"></i>
                </div>
            </div>
            <button id="add">
                <i className="fa-solid fa-plus"></i>
                <span>Add a post!</span>
            </button>
        </section>
    );
}

export default Modes;
