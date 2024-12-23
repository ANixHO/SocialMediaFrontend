import {useEffect, useState} from "react";

function InfiniteScroll({fetchData, renderData, hasMore, disable}) {
    const [page, setPage] = useState(0);

    useEffect(() => {
        if (hasMore && !disable) {
            fetchData(page);
            window.addEventListener('scroll', handleScroll);
        }
        return () => window.removeEventListener('scroll', handleScroll);
    }, [page]);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop
            === document.documentElement.offsetHeight
        ) {
            setPage(page + 1);
        }
    };
    return renderData();

}

export default InfiniteScroll;