import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

function App() {
    const [user, setUser] = useState('user');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            console.log(`User changing with value of ${user}`);
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    return <div>App</div>;
}

export default App;
