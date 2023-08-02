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
