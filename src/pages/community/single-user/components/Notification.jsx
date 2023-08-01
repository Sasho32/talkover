import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';

const icons = {
    approved: 'fa-circle-check',
    banned: 'fa-ban',
    moderator: 'fa-user-gear',
    mentioned: 'fa-at',
};

const messages = {
    approved: username => `${username} has approved your post!`,
    banned: username => `You have been banned by ${username}!`,
    moderator: username => `${username} has made you moderator!`,
    mentioned: username => `${username} mentioned you in a comment!`,
};

function Notification({ notification }) {
    const queryClient = useQueryClient();

    const { mutate } = useMutation(
        async ({ toBeMerged, id }) => {
            const notificationRef = doc(db, 'notifications', id);

            await updateDoc(notificationRef, toBeMerged);

            return { ...toBeMerged, id };
        },
        {
            onSuccess: toBeMerged => {
                queryClient.setQueryData(
                    ['notifications'],
                    ({ pageParams, pages }) => {
                        const newPages = pages.map(page => {
                            return {
                                lastVisibleDoc: page.lastVisibleDoc,
                                data: page.data.map(notification =>
                                    notification.id === toBeMerged.id
                                        ? { ...notification, ...toBeMerged }
                                        : notification
                                ),
                            };
                        });
                        return {
                            pageParams,
                            pages: newPages,
                        };
                    }
                );
                // няма смисъл от чек дали съществува, защото тригърваме mutate-а именно през него
            },
        }
    );

    if (!notification) return <div className={`notification skeleton`}></div>;

    function readHandler() {
        mutate({ toBeMerged: { read: true }, id: notification.id });
    }

    return (
        // оставям външния див, защото ми трябва да е inline-block, а вътрешният - флекс
        <div
            onClick={readHandler}
            className={`notification ${notification.read ? '' : 'new'}`}
        >
            <div className="notification-container">
                <div className="notification-media">
                    <div
                        style={{
                            backgroundImage: notification.senderPic
                                ? `url(${notification.senderPic})`
                                : {},
                        }}
                        className={`notification-user-avatar ${
                            notification.senderPic ? '' : 'empty'
                        }`}
                    >
                        {!notification.senderPic &&
                            notification.senderUsername[0].toUpperCase()}
                    </div>
                    <i
                        className={`fa-solid ${notification.type} ${
                            icons[notification.type]
                        } notification-reaction`}
                    ></i>
                </div>
                <div className="notification-content">
                    <p className="notification-text">
                        {messages[notification.type](
                            notification.senderUsername
                        )}
                    </p>
                    <span className="notification-timer">
                        {calculateRelativeTime(notification.createdAt)}
                    </span>
                </div>
            </div>
        </div>
    );
}

function calculateRelativeTime(firebaseTimestamp) {
    const now = new Date();
    const timestamp = firebaseTimestamp.toDate(); // Convert Firebase timestamp to JavaScript Date object
    const diffInMilliseconds = now - timestamp;

    const timeUnits = [
        {
            value: Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 365)),
            unit: 'year',
        },
        {
            value: Math.floor(
                diffInMilliseconds / (1000 * 60 * 60 * 24 * 30.44)
            ),
            unit: 'month',
        },
        {
            value: Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 7)),
            unit: 'week',
        },
        {
            value: Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)),
            unit: 'day',
        },
        {
            value: Math.floor(diffInMilliseconds / (1000 * 60 * 60)),
            unit: 'hour',
        },
        { value: Math.floor(diffInMilliseconds / (1000 * 60)), unit: 'minute' },
    ];

    for (const { value, unit } of timeUnits) {
        if (value > 0) {
            return `${value} ${value === 1 ? unit : unit + 's'} ago`;
        }
    }

    return 'Just now';
}

export default Notification;
