function OwnOptions({ editing, openEditMode, confirmHandler, discardHandler }) {
    if (editing)
        return (
            <>
                <i
                    onClick={confirmHandler}
                    className="fa-solid fa-circle-check"
                    style={{ color: 'green' }}
                ></i>
                <i
                    onClick={discardHandler}
                    className="fa-solid fa-circle-xmark"
                    style={{ color: 'red' }}
                ></i>
            </>
        );

    return (
        <i
            style={{ color: 'brown' }}
            onClick={openEditMode}
            className="fa-solid fa-pen-to-square"
        ></i>
    );

    {
        /* <!-- moje i bez da e div shtoto ima samo text align right --> */
    }
}

export default OwnOptions;
