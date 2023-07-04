import Category from './Category';
import Modes from './Modes';

const categories = {
    All: 'fa-list-ul',
    Politics: 'fa-landmark',
    Sports: 'fa-volleyball',
    Life: 'fa-hand',
    Music: 'fa-headphones',
    Movies: 'fa-clapperboard',
};

function Filters({ mode, switchToPosts, switchToPolls }) {
    return (
        <section className="filters">
            <section className="categories">
                <h2>CATEGORIES</h2>
                <div id="categories">
                    {Object.keys(categories).map(category => (
                        <Category
                            key={category}
                            name={category}
                            number="12"
                            icon={categories[category]}
                        />
                    ))}
                </div>
            </section>
            <Modes
                mode={mode}
                switchToPosts={switchToPosts}
                switchToPolls={switchToPolls}
            />
        </section>
    );
}

export default Filters;
