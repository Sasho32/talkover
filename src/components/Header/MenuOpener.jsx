import { useContext } from 'react';
import { NavContext } from '../Nav/NavContext';
import './MenuOpener.scss';

function MenuOpener() {
    const { toggleNav } = useContext(NavContext);

    return <i onClick={toggleNav} className="fa-solid fa-bars"></i>;
}

export default MenuOpener;
