import { signOut } from 'firebase/auth';
import { useContext, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { auth } from '../../firebase';
import { UserContext } from '../../UserContext';
import NavLogo from './NavLogo';
import NavigationLink from './NavigationLink';
import './Nav.scss';

function Nav() {
    const { user } = useContext(UserContext);
    const [opened, setOpened] = useState(false);
    // при отваряне на страницата в mobile искам да е скрито по дефолт, а и за desktop - не го бърка така или иначе

    const routes = {
        '/posts': {
            icon: 'home',
            title: 'Home',
        },
        '/posts/my-posts': {
            icon: 'newspaper',
            title: 'My posts',
        },
        '/posts/liked-posts': {
            icon: 'favorite',
            title: 'Liked',
        },
        '/my-comments': {
            icon: 'chat',
            title: 'Comments',
        },
        '/community': {
            icon: 'group',
            title: 'Community',
        },
        [`/community/${user.uid}`]: {
            icon: 'account_circle',
            title: 'Profile',
        },
    };
    // трябва да се инициализира в компонента, защото ми трябва достъп до uid-то
    // няма да го слагам в useMemo, защото мисля, че инициализацията на обикновен обект не би коствала нищо

    function toggleNav() {
        setOpened(opnd => !opnd);
        // да няма излишни рирендъри
    }

    function closeNav() {
        if (opened) setOpened(false);
    }

    return (
        <>
            <nav className={`${opened ? 'active' : ''}`}>
                <NavLogo />
                <ul>
                    {Object.keys(routes).map(route => {
                        return (
                            <NavigationLink
                                key={route}
                                closeNav={closeNav}
                                route={route}
                                routeInfo={routes[route]}
                            />
                        );
                        // с key на li в Navigation link мрънка, затова - тука
                    })}

                    <li key="logout">
                        <Link onClick={() => signOut(auth)}>
                            <span className="icon">
                                <span className="material-symbols-outlined">
                                    logout
                                </span>
                            </span>
                            <span className="title">Log Out</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            <Outlet context={{ toggleNav }} />
        </>
    );
}

export default Nav;
