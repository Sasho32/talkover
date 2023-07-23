function ModOptions({ warnHandler, removeWarnHandler, banHandler, isWarned }) {
    console.log(isWarned);
    return (
        <>
            {isWarned ? (
                <>
                    <i
                        onClick={removeWarnHandler}
                        style={{ color: 'green' }}
                        className="fa-solid fa-user-check"
                    ></i>
                    <i
                        onClick={banHandler}
                        style={{ color: 'black' }}
                        className="fa-solid fa-user-slash"
                    ></i>
                </>
            ) : (
                <i
                    onClick={warnHandler}
                    style={{ color: 'orange' }}
                    className="fa-solid fa-triangle-exclamation"
                ></i>
            )}
        </>
    );
}

export default ModOptions;
