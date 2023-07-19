import { useEffect } from 'react';
import { useRef } from 'react';

function HiddenLoader({ loadNextBatch }) {
    const loadMoreRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadNextBatch();
                    }
                });
            },
            { threshold: 1 }

            // The "threshold" parameter specifies when the callback should be triggered based on the visibility of the target element. It can be set as a single value or an array of values between 0 and 1. Each value in the threshold array represents a percentage of the target element's visibility required to trigger the callback.
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [loadNextBatch]);

    return <div ref={loadMoreRef}></div>;
}

export default HiddenLoader;
