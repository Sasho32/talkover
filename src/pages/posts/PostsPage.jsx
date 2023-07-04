import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Filters from './components/Filters';
import PostCard from './components/PostCard';

function PostsPage() {
    const { category: urlCtg, page: urlPg, filteredBy: urlFb } = useParams();

    const [currentPage, setCurrentPage] = useState(urlPg || 1);
    const [category, setCategory] = useState(urlCtg || 'all');
    const [filteredBy, setFilteredBy] = useState(urlFb || 'published');
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(10);
    const [mode, setMode] = useState('posts');

    function switchToPosts() {
        setMode('posts');
    }
    function switchToPolls() {
        setMode('polls');
    }

    return (
        <>
            <Filters
                mode={mode}
                switchToPosts={switchToPosts}
                switchToPolls={switchToPolls}
            />
            <section className="content">
                <h2>BLOGS</h2>
                <section className="blogs">
                    <PostCard />
                </section>
            </section>
        </>
    );
}

export default PostsPage;
