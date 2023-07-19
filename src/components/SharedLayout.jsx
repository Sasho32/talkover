import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Nav from './Nav/Nav';
import Header from './Header/Header';
import WarningMessage from './WarningMessage';
import { NavContext } from '../contexts/NavContext';

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

    const [openedWarning, setOpenedWarning] = useState(false);

    useEffect(() => {
        setOpenedWarning(userRecord?.intruder === 'warned');
    }, [userRecord]);

    return (
        <>
            <NavContext.Provider value={{ toggleNav, closeNav }}>
                <Nav openedNav={openedNav} />
                <Header />
            </NavContext.Provider>
            <main className="user">
                {openedWarning && (
                    <WarningMessage setOpenedWarning={setOpenedWarning} />
                )}
                <Outlet context={stats} />
            </main>
        </>
    );
}

export default SharedLayout;
