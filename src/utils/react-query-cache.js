export function replaceElementInCache(element, field, { pageParams, pages }) {
    pages = pages.forEach(({ data, lastVisibleDoc }) => {
        data.forEach((user, index) => {
            if (user[field] === element[field]) {
                console.log(user);
                data[index] = element;
                console.log(element);
            }
        });
    });
}
export function replaceElementInCacheMerge(
    element,
    field,
    { pageParams, pages }
) {
    pages = pages.forEach(({ data, lastVisibleDoc }) => {
        data.forEach((user, index) => {
            if (user[field] === element[field]) {
                data[index] = { ...data[index], ...element };
            }
        });
    });
}
