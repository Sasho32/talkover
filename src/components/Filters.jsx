import Category from '../pages/posts/components/Category';

const categories = {
    All: 'fa-list-ul',
    Politics: 'fa-landmark',
    Sports: 'fa-volleyball',
    Life: 'fa-hand',
    Music: 'fa-headphones',
    Movies: 'fa-clapperboard',
};

function Filters() {
    return (
        <>
            <section className="filters">
                <section className="categories">
                    <h2>CATEGORIES</h2>
                    <div id="categories">
                        {Object.keys(categories).map(category => (
                            <Category
                                key={category}
                                name={category}
                                number={12}
                                icon={categories[category]}
                            />
                        ))}
                    </div>
                </section>
            </section>
        </>
    );
}

export default Filters;
