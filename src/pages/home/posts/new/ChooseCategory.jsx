import { categories as importedCategories } from '../../dashboard/components/Filters';
import './ChooseCategory.scss';

const categories = Object.keys(importedCategories)
    .filter(category => category !== 'All')
    .map(category => category.toLowerCase());

function ChooseCategory({ category, setCategory }) {
    return (
        <div className="choose-category">
            {categories.map(cat => (
                <span
                    className={`category ${cat === category ? 'active' : ''}`}
                    onClick={() => setCategory(cat)}
                    key={cat}
                >
                    {cat}
                </span>
            ))}
        </div>
    );
}

export default ChooseCategory;
