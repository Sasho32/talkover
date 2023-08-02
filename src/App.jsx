import { useState, useEffect } from 'react';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
    Navigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserContext } from './contexts/UserContext';
import AuthRoute from './protected-routes/AuthRoute';
import GuestRoute from './protected-routes/GuestRoute';
import ModRoute from './protected-routes/ModRoute';
import NonBannedRoute from './protected-routes/NonBannedRoute';
import AuthPage from './pages/auth/AuthPage';
import SharedLayout from './components/SharedLayout';
import DashboardLayout from './pages/home/dashboard/components/DashboardLayout';
import DashboardPage from './pages/home/dashboard/DashboardPage';
import LikedPostsPage from './pages/liked-posts/LikedPostsPage';
import MyPostsPage from './pages/my-posts/MyPostsPage';
import './App.scss';
import './Main.scss';
import NewPollPage from './pages/home/polls/new/NewPollPage';
import NewPostPage from './pages/home/posts/new/NewPostPage';
import PendingPostsPage from './pages/pending-posts/PendingPostsPage';
import CommunityPage from './pages/community/CommunityPage';
import SingleUserPage from './pages/community/single-user/SingleUserPage';
import SinglePostPage from './pages/home/posts/single-post/SinglePostPage';

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
                            <Route path="posts" element={<DashboardPage />} />

                            <Route path="polls" element={<DashboardPage />} />
                        </Route>
                    </Route>

                    <Route path="/home">
                        <Route path="posts">
                            <Route
                                path=":postId"
                                element={<SinglePostPage />}
                            />
                            <Route element={<NonBannedRoute />}>
                                <Route path="new" element={<NewPostPage />} />
                            </Route>
                        </Route>
                        {/* ще приема qp comment=commentId => ако го има директно вкарва в comments mode и го търси - ако го няма изкарва коментарите поред и просто някакъв спан 'comment you are looking for was not found';
                                тр вкарам и editing на коментар вътре
                                */}
                        <Route path="polls">
                            <Route element={<ModRoute />}>
                                <Route path="new" element={<NewPollPage />} />
                            </Route>
                        </Route>
                    </Route>

                    <Route path="/liked-posts" element={<LikedPostsPage />} />
                    <Route path="/my-posts" element={<MyPostsPage />} />
                    <Route element={<ModRoute />}>
                        <Route
                            path="/pending-posts"
                            element={<PendingPostsPage />}
                        />
                    </Route>

                    <Route
                        path="/my-comments"
                        element={<span>My comments page</span>}
                    />
                    <Route path="/community">
                        <Route index element={<CommunityPage />} />
                        <Route path=":userId" element={<SingleUserPage />} />
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
