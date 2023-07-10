import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Filters from './Filters';
import { FiltersContext } from '../pages/FiltersContext';
import HiddenLoader from './HiddenLoader';
import useQueryParams from '../custom-hooks/useQueryParams';
import useForumStats from '../custom-hooks/useForumStats';
import useInfiniteScroll from '../custom-hooks/useInfiniteScroll';

const STALE_TIME = Infinity;
const ITEMS_PER_PAGE = 6;

function DashboardLayout() {
    const queryParams = useQueryParams();

    const mode = useLocation().pathname.split('/')[1];
    const category = queryParams.get('category') || 'all';
    const filteredBy = queryParams.get('filteredBy') || 'published';

    return (
        <>
            <FiltersContext.Provider
                value={{
                    mode,
                    category,
                    filteredBy,
                }}
            >
                <Filters />
                <Outlet />
            </FiltersContext.Provider>
        </>
    );
}

export default DashboardLayout;
