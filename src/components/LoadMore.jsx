import './LoadMore.scss';

function LoadMore({ onClick }) {
    return (
        <section onClick={onClick} className="load-more-btn">
            <i className="fa-solid fa-circle-plus"></i>
            <span>Load more...</span>
        </section>
    );
}

export default LoadMore;
