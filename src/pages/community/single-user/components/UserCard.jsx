import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { replaceElementInCacheMerge } from '../../../../utils/react-query-cache';
import { getStatus, handleImageUpload } from '../../../../utils/user';
import ModOptions from './ModOptions';
import AdminOptions from './AdminOptions';
import OwnOptions from './OwnOptions';
import ProfilePicCutter from '../../../../components/ProfilePicCutter';
import './UserCard.scss';

function UserCard({ queryClient, me, user }) {
    const [editing, setEditing] = useState(false);
    const [newProfilePic, setNewProfilePic] = useState(null);
    const [newBio, setNewBio] = useState(user?.bio);
    // user може да е null

    const { mutate, isLoading: isMutating } = useMutation(
        async ({ toBeMerged, uid }) => {
            // пробвах да подам uid като втори аргумент - не става
            const userRef = doc(db, 'users', uid);

            await updateDoc(userRef, toBeMerged);

            return { ...toBeMerged, uid: user.uid };
        },
        {
            onSuccess: toBeMerged => {
                const usersCache = queryClient.getQueryData(['users']);
                if (usersCache)
                    replaceElementInCacheMerge(toBeMerged, 'uid', usersCache);

                queryClient.setQueryData(['users', user.uid], oldData => ({
                    ...oldData,
                    ...toBeMerged,
                }));
            },
        }
    );

    if (!user || isMutating)
        return (
            <section>
                <h2>profile</h2>
                <section id="user-card">
                    <section id="info" className="skeleton"></section>
                </section>
            </section>
        );

    const myProfile = me.uid === user.uid;
    const amAdmin = me.admin;
    const isAdmin = user.role === 'admin';
    const amMod = me.role === 'moderator';
    const isMod = user.role === 'moderator';
    const isWarned = user.intruder === 'warned';
    const isBanned = user.intruder === 'banned';
    const status = getStatus(user);

    async function confirmHandler() {
        const toBeMerged = {};

        if (newProfilePic)
            toBeMerged.pic = await handleImageUpload(
                'profile_pics',
                user.uid,
                newProfilePic
            );

        setNewProfilePic(null);

        if (newBio !== user.bio) toBeMerged.bio = newBio;

        setEditing(false);

        if (!Object.keys(toBeMerged).length) return;

        mutate({ toBeMerged, uid: me.uid });
    }

    function openEditMode() {
        setEditing(true);
    }

    function discardHandler() {
        setEditing(false);
    }

    function makeModHandler() {
        mutate({ toBeMerged: { role: 'moderator' }, uid: user.uid });
    }
    function removeModHandler() {
        mutate({ toBeMerged: { role: 'user' }, uid: user.uid });
    }
    function warnHandler() {
        mutate({ toBeMerged: { intruder: 'warned' }, uid: user.uid });
    }
    function removeWarnHandler() {
        mutate({ toBeMerged: { intruder: 'false' }, uid: user.uid });
    }
    function banHandler() {
        mutate({ toBeMerged: { intruder: 'banned' }, uid: user.uid });
    }

    return (
        <section>
            <h2>profile</h2>
            <section id="user-card">
                <section id="options">
                    {myProfile && (
                        <OwnOptions
                            editing={editing}
                            openEditMode={openEditMode}
                            confirmHandler={confirmHandler}
                            discardHandler={discardHandler}
                        />
                    )}

                    {!myProfile && amAdmin && !isWarned && !isBanned && (
                        <AdminOptions
                            makeModHandler={makeModHandler}
                            removeModHandler={removeModHandler}
                            isMod={isMod}
                        />
                    )}
                    {!myProfile && amMod && !isMod && !isAdmin && !isBanned && (
                        <ModOptions
                            warnHandler={warnHandler}
                            removeWarnHandler={removeWarnHandler}
                            banHandler={banHandler}
                            isWarned={isWarned}
                        />
                    )}
                </section>
                <section id="info">
                    <section id="left">
                        <div id="background">
                            <ProfilePicCutter
                                user={isMutating ? null : user}
                                width={170}
                            />
                        </div>
                        {editing ? (
                            <input
                                onChange={e =>
                                    setNewProfilePic(e.target.files[0])
                                }
                                type="file"
                                name="Photo"
                                className="custom-file-input"
                            />
                        ) : (
                            <>
                                <span>{user.username}</span>
                                <div id="role" className={status}>
                                    <span>{status}</span>
                                </div>
                            </>
                        )}
                    </section>
                    <section id="right">
                        <section id="stats">
                            <div className="stat">
                                <span>Posts</span>
                                <span>{user.posts}</span>
                            </div>
                            <div className="stat">
                                <span>Comments</span>
                                <span>{user.comments.length}</span>
                            </div>
                            <div className="stat bio">
                                <span>Bio</span>
                                {editing ? (
                                    <textarea
                                        value={newBio}
                                        onChange={e =>
                                            setNewBio(e.target.value)
                                        }
                                    ></textarea>
                                ) : (
                                    <span>
                                        {user.bio || 'No bio presented.'}
                                    </span>
                                )}
                            </div>
                            <div className="stat">
                                <span>Registered</span>
                                <span>
                                    {user.joinedOn.toDate().toDateString()}
                                </span>
                            </div>
                        </section>
                    </section>
                </section>
            </section>
        </section>
    );
}

export default UserCard;
