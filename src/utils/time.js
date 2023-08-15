export function calculateRelativeTime(firebaseTimestamp) {
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

export function firebaseTimestampToHour(firebaseTimestamp) {
    // Convert the Firebase timestamp to a JavaScript Date object
    const jsDate = firebaseTimestamp.toDate();

    // Get the hours and minutes from the Date object
    const hours = jsDate.getHours();
    const minutes = jsDate.getMinutes();

    // Format the hours and minutes as "HH:mm"
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;

    return formattedTime;
}

export function formatDateFromFirebaseTimestamp(firebaseTimestamp) {
    const jsDate = firebaseTimestamp.toDate();
    const day = jsDate.getDate();
    const month = jsDate.toLocaleString('en-US', { month: 'long' });

    // Format the date as "28 May" or "30 June"
    const formattedDate = `${day} ${month}`;

    return formattedDate;
}
