import { signOut } from 'firebase/auth';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { UserContext } from '../../UserContext';
import NavLogo from './NavLogo';
import NavigationLink from './NavigationLink';
import './Nav.scss';

function Nav({ openedNav }) {
    const { user } = useContext(UserContext);

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

    return (
        <>
            <nav className={`${openedNav ? 'active' : ''}`}>
                <NavLogo />
                <ul>
                    {Object.keys(routes).map(route => {
                        return (
                            <NavigationLink
                                key={route}
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
        </>
    );
}

export default Nav;
