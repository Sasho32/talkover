import { NavLink } from 'react-router-dom';
import './NavigationLink.scss';

function NavigationLink({ closeNav, route, routeInfo }) {
    return (
        <li onClick={closeNav} className="link">
            <NavLink to={route} end>
                {/* без end attr /posts ще е active и при така да се каже - child route-овете си */}
                <span className="icon">
                    <span className="material-symbols-outlined">
                        {routeInfo.icon}
                    </span>
                </span>
                <span className="title">{routeInfo.title}</span>
            </NavLink>
        </li>
    );
}

export default NavigationLink;
