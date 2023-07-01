import Header from './Header/Header';
import Nav from './Nav/Nav';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { NavContext } from './Nav/NavContext';

function SharedLayout() {
    const [openedNav, setOpenedNav] = useState(false);
    // при отваряне на страницата в mobile искам да е скрито по дефолт, а и за desktop - не го бърка така или иначе

    function toggleNav() {
        setOpenedNav(opnd => !opnd);
        // да няма излишни рирендъри
    }

    function closeNav() {
        if (openedNav) setOpenedNav(false);
    }

    return (
        <>
            <NavContext.Provider value={{ toggleNav, closeNav }}>
                <Nav openedNav={openedNav} />
                <Header />
            </NavContext.Provider>
            <main className="user">
                <Outlet />
            </main>
        </>
    );
}

export default SharedLayout;
