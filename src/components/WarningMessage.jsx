import { useRef } from 'react';
import './WarningMessage.scss';

function WarningMessage({ setOpenedWarning }) {
    const alertRef = useRef(null);

    return (
        <div ref={alertRef} className="alert">
            <h3>Be careful!</h3>
            <span>
                If you violate our guidelines again, your account may be banned,
                which will deprive you of the opportunity to create new posts or
                to leave comments under existing ones.
            </span>
            <i
                onClick={() => {
                    alertRef.current.style.opacity = 0;
                    setTimeout(() => {
                        setOpenedWarning(false);
                    }, 700);
                }}
                className="fa-regular fa-circle-xmark close"
            ></i>
        </div>
    );
}

export default WarningMessage;
