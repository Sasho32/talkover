import Interaction from './Interaction';
import './PostCard.scss';

const interactions = {
    views: 'fa-eye',
    likes: 'fa-thumbs-up',
    dislikes: 'fa-thumbs-down',
    comments: 'fa-comment',
};

function PostCard() {
    return (
        <article className="blog">
            <div className="author-info">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/NeilPatrickHarrisHWOFSept2011.jpg/280px-NeilPatrickHarrisHWOFSept2011.jpg"
                    alt="profile"
                />
            </div>
            <div className="image"></div>
            <div className="stats">
                <div className="interactions">
                    {Object.keys(interactions).map(interaction => (
                        <Interaction
                            icon={interactions[interaction]}
                            count="1948"
                        />
                    ))}
                </div>
                <div className="timestamp">
                    <span className="date">3 days ago</span>
                </div>
            </div>
            <div className="main-content">
                <h3>HEADING</h3>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Accusamus minus consequuntur recusandae sit molestiae illo
                    reprehenderit quasi quo nihil veritatis maiores, officia
                    repudiandae, cupiditate provident, esse in ducimus fugiat
                    quia?
                </p>
            </div>
            <button>Continue reading...</button>
        </article>
    );
}

export default PostCard;
