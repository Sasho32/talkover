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
import SharedLayout from './components/SharedLayout';
import PostsPage from './pages/posts/PostsPage';
import DashboardLayout from './components/DashboardLayout';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PollsPage from './pages/polls/PollsPage';
import LikedPostsPage from './pages/liked-posts/LikedPostsPage';

const client = new QueryClient();

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<GuestRoute />}>
                <Route path="/auth" element={<AuthPage />} />
            </Route>
            <Route element={<AuthRoute />}>
                <Route element={<SharedLayout />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/home">
                            <Route path="posts" element={<PostsPage />} />

                            <Route path="polls" element={<PollsPage />} />
                        </Route>
                    </Route>

                    <Route path="/home">
                        <Route path="posts">
                            <Route
                                path=":id"
                                element={<span>Single post view</span>}
                            />
                            <Route element={<NonBannedRoute />}>
                                <Route
                                    path="new"
                                    element={<span>Create post view</span>}
                                />
                            </Route>
                        </Route>
                        {/* ще приема qp comment=commentId => ако го има директно вкарва в comments mode и го търси - ако го няма изкарва коментарите поред и просто някакъв спан 'comment you are looking for was not found';
                                тр вкарам и editing на коментар вътре
                                */}
                        <Route path="polls">
                            <Route element={<ModRoute />}>
                                <Route
                                    path="new"
                                    element={<span>Create poll view</span>}
                                />
                            </Route>
                        </Route>
                    </Route>

                    <Route
                        path="/liked-posts"
                        element={<span>Liked posts page</span>}
                    />
                    <Route path="/my-posts" element={<PostsPage />} />
                    <Route element={<ModRoute />}>
                        <Route
                            path="/pending-posts"
                            element={<span>Pending posts view</span>}
                        />
                    </Route>

                    <Route
                        path="/my-comments"
                        element={<span>My comments page</span>}
                    />
                    <Route path="/community">
                        <Route index element={<span>Community page</span>} />
                        <Route
                            path=":userId"
                            element={<span>Profile page</span>}
                        />
                    </Route>
                </Route>
            </Route>
            <Route path="*" element={<Navigate to="/home/posts" />} />
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
            unsubscribeFromUser = onSnapshot(userDoc, async doc => {
                const { claims } = await user.getIdTokenResult();

                setUserRecord({
                    ...doc.data(),
                    admin: claims.admin ? true : false,
                });
            });
        }

        return () => {
            unsubscribeFromUser();
            setUserRecord(null);
        };
    }, [user]);

    return (
        <QueryClientProvider client={client}>
            <UserContext.Provider value={{ user, userRecord }}>
                <RouterProvider router={router} />
            </UserContext.Provider>
        </QueryClientProvider>
    );
}

export default App;
