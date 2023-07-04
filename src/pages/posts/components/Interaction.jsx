function Interaction({ icon, count }) {
    return (
        <div className="interaction">
            <i className={`fa-regular ${icon}`}></i>
            <span>{count}</span>
        </div>
    );
}

export default Interaction;
