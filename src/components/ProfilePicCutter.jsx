import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import './ProfilePicCutter.scss';

function ProfilePicCutter({ src }) {
    const { userRecord } = useContext(UserContext);
    const navigate = useNavigate();

    function goToProfile() {
        if (userRecord) navigate(`/community/${userRecord.uid}`);
    }

    return (
        <div onClick={goToProfile} className="profile-pic-cutter">
            {src ? (
                <img src={src} alt="profile_pic" />
            ) : (
                userRecord?.username[0].toUpperCase()
            )}
        </div>
    );
}

export default ProfilePicCutter;
