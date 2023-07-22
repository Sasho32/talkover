import { useNavigate } from 'react-router-dom';
import { getStatus } from '../../utils/user';
import ProfilePicCutter from '../../components/ProfilePicCutter';
import './UserSwiper.scss';

const icons = {
    banned: '-slash',
    admin: '-shield',
    moderator: '-gear',
};

function UserSwiper({ user, onClick, activeUser }) {
    const navigate = useNavigate();

    if (!user) return <article className={`user skeleton`}></article>;

    return (
        <article
            onClick={() => {
                onClick();
            }}
            className={`user ${activeUser === user.uid ? 'opened' : ''}`}
        >
            <div className="main-info">
                <div
                    onClick={e => {
                        e.stopPropagation();
                        navigate(user.uid);
                    }}
                    className="nickname"
                >
                    <ProfilePicCutter user={user} />
                    <span>{user.username}</span>
                </div>
                <i className="fa-solid fa-angle-up"></i>
            </div>
            <div className="hidden">
                <div className="hidden-content">
                    <div className={`counter ${getStatus(user)}`}>
                        <i
                            className={`fa-solid fa-user${
                                icons[getStatus(user)] || ''
                            }`}
                        ></i>
                        <span>{getStatus(user)}</span>
                    </div>
                    <div className="counter">
                        <i className="fa-solid fa-file-lines"></i>
                        <span>{user.posts}</span>
                    </div>
                    <div className="counter">
                        <i className="fa-regular fa-comments"></i>
                        <span>{user.comments.length}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default UserSwiper;
