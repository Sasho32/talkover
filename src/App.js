import { useState, useEffect } from 'react';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { UserContext } from './UserContext';
import { auth } from './firebase';
import AuthRoute from './protected-routes/AuthRoute';
import NonBannedRoute from './protected-routes/NonBannedRoute';
import ModRoute from './protected-routes/ModRoute';

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/auth" element={<span>Sign in/up view</span>} />
            <Route element={<AuthRoute />}>
                <Route element={<h1>Shared nav</h1>}>
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
                        path="/profile-id"
                        element={<span>Profile page</span>}
                    />
                    <Route
                        path="/my-comments"
                        element={<span>My comments page</span>}
                    />
                    <Route
                        path="/community"
                        element={<span>Community page</span>}
                    />
                </Route>
            </Route>
            <Route path="*" element={<span>Page not found!</span>} />
        </>
    )
);

function App() {
    const [user, setUser] = useState(null);

    const userRecord = user && getUserRecord(user.uid);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            console.log(`User changing with value of ${user}`);
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                userRecord,
            }}
        >
            <RouterProvider router={router} />;
        </UserContext.Provider>
    );
}

export default App;
