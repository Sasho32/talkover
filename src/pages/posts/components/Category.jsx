import './Category.scss';

function Category({ name, number, icon }) {
    return (
        <div className="category">
            <span className="title"> {`${name}(${number})`} </span>
            <i className={`fa-solid ${icon}`}></i>
        </div>
    );
}

export default Category;
