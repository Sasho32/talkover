import { useContext } from 'react';
import { UserContext } from '../../UserContext';
import './Header.scss';
import { useNavigate } from 'react-router-dom';
import Greeting from './Greeting';
import MenuOpener from './MenuOpener';
import ProfilePicCutter from '../ProfilePicCutter';

function Header() {
    const { userRecord } = useContext(UserContext);
    const navigate = useNavigate();

    function goToProfile() {
        navigate(`/community/${userRecord.uid}`);
    }

    console.log('rerendering header');
    /*  лошото е, въпреки че са съседни елементи - header и респективно всяко view са деца на Nav и ще рендерират всеки път при промяна,
    но само това е начина да са share-нати nav-а и header-а; плюс това те така или иначе ще трябва да ререндерират, защото се сменя view-то */

    return (
        <header>
            <MenuOpener />
            <div id="personal-info">
                <Greeting
                    goToProfile={goToProfile}
                    username={userRecord?.username}
                    role={userRecord?.role}
                />
                <ProfilePicCutter src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXiexOIV0OhagbnFolPgbHwVDZLliwXzdS_w&usqp=CAU" />
            </div>
        </header>
    );
}

export default Header;
