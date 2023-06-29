import { useState, useEffect } from 'react';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
    Navigate,
} from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';
import { UserContext } from './UserContext';
import { auth, db } from './firebase';
import AuthRoute from './protected-routes/AuthRoute';
import NonBannedRoute from './protected-routes/NonBannedRoute';
import ModRoute from './protected-routes/ModRoute';
import AuthPage from './pages/auth/AuthPage';
import GuestRoute from './protected-routes/GuestRoute';
import './App.scss';
import './Main.scss';
import Nav from './components/Nav/Nav';
import Header from './components/Header/Header';

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<GuestRoute />}>
                <Route path="/auth" element={<AuthPage />} />
            </Route>
            <Route element={<AuthRoute />}>
                <Route element={<Nav />}>
                    <Route element={<Header />}>
                        <Route path="/posts">
                            <Route index element={<span>Posts view</span>} />
                            <Route element={<ModRoute />}>
                                <Route
                                    path="pending-posts"
                                    element={<span>Pending posts view</span>}
                                />
                            </Route>
                            <Route
                                path="my-posts"
                                element={<span>My posts view</span>}
                            />
                            <Route
                                path="liked-posts"
                                element={<span>Liked posts view</span>}
                            />
                            <Route
                                path=":id"
                                element={<span>Single post view</span>}
                            />
                            <Route
                                path=":id/comments"
                                element={<span>Single post comments view</span>}
                            />
                            <Route
                                path=":id/comments/comment-id"
                                element={
                                    <span>
                                        Single post specific comment first view
                                    </span>
                                }
                            />
                            <Route element={<NonBannedRoute />}>
                                <Route
                                    path="new-post"
                                    element={<span>Create post view</span>}
                                />
                                <Route
                                    path=":id/edit"
                                    element={<span>Edit post view</span>}
                                />
                                {/* Ownership protection-ът ще е в самия page component */}
                            </Route>
                        </Route>
                        <Route path="/polls">
                            <Route index element={<span>Polls view</span>} />
                            <Route element={<ModRoute />}>
                                <Route
                                    path="new-poll"
                                    element={<span>Create poll view</span>}
                                />
                            </Route>
                        </Route>
                        <Route
                            path="/my-comments"
                            element={<span>My comments page</span>}
                        />
                        <Route path="/community">
                            <Route
                                index
                                element={<span>Community page</span>}
                            />
                            <Route
                                path=":userId"
                                element={<span>Profile page</span>}
                            />
                        </Route>
                    </Route>
                </Route>
            </Route>
            <Route path="*" element={<Navigate to="/posts" />} />
        </>
    )
);

function App() {
    const [user, setUser] = useState('initial');
    const [userRecord, setUserRecord] = useState(null);

    useEffect(() => {
        const unsubscribeFromAuth = onAuthStateChanged(auth, user => {
            setUser(user);
        });

        return () => {
            unsubscribeFromAuth();
        };
    }, []);

    useEffect(() => {
        let unsubscribeFromUser = () => {};

        if (user?.uid) {
            const userDoc = doc(db, 'users', user.uid);
            unsubscribeFromUser = onSnapshot(userDoc, doc => {
                setUserRecord(doc.data());
            });
        }

        return () => unsubscribeFromUser();
    }, [user]);

    return (
        <UserContext.Provider value={{ user, userRecord }}>
            <RouterProvider router={router} />
        </UserContext.Provider>
    );
}

export default App;
