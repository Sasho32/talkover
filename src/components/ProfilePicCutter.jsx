import { useNavigate } from 'react-router-dom';
import './ProfilePicCutter.scss';

function ProfilePicCutter({ user }) {
    const navigate = useNavigate();

    if (!user) return <div className="profile-pic-cutter skeleton"></div>;
    // за директен достъп от url - на header-а се подава userRecord на profileCutter-а, което първоначално е null

    const style = user.pic ? { backgroundImage: `url(${user.pic})` } : {};
    // ако е само background пренаписва и другите пропъртита в css файла

    return (
        <div
            style={style}
            onClick={e => {
                navigate(`/community/${user.uid}`);
                e.stopPropagation();
                // заради article.user в community
            }}
            className={`profile-pic-cutter ${user.pic ? '' : 'empty'}`}
        >
            {!user.pic && user.username[0].toUpperCase()}
            {/* не е с or, за да не eval-не в url-а */}
        </div>
    );
}

export default ProfilePicCutter;
