import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

const scrollRestorations: RegExp[] = [
    /^menu.*/i
];

const scrollTopExceptions: RegExp[] = [
    ...scrollRestorations, // pages that have scroll restoration are excluded from top-scrolling
];

const AutoScroll: React.FC = (): null => {
    const location = useLocation();

    useEffect(() => {
        const path: string = location.pathname.substring(1);

        // if this is not a scroll exception, scroll to the top
        if (!scrollTopExceptions.some(regex => regex.test(path))) {
            window.scroll({top: 0});
        }

        // if this is a scroll restoration
        if (scrollRestorations.some(regex => regex.test(path))) {
            // scroll to the stored y (or 0)
            const key: string = `${path}-scroll`;
            const y: number = Number.parseInt(sessionStorage.getItem(key) ?? '0');
            window.scroll({top: y});

            // scroll handler
            const onScroll = () => {
                sessionStorage.setItem(key, window.scrollY.toString());
            };
            window.addEventListener('scroll', onScroll);
            return () => {
                window.removeEventListener('scroll', onScroll);
            };
        }
    }, [location]);
    return null;
};
export default AutoScroll;