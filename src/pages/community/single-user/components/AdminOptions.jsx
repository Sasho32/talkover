function AdminOptions({ makeModHandler, removeModHandler, isMod }) {
    return (
        <>
            {isMod ? (
                <i
                    onClick={removeModHandler}
                    style={{ color: 'grey' }}
                    className="fa-solid fa-user"
                ></i>
            ) : (
                <i
                    onClick={makeModHandler}
                    style={{ color: 'blue' }}
                    className="fa-solid fa-user-gear"
                ></i>
            )}
        </>
    );
}

export default AdminOptions;
