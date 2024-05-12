import './home.scss';
import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import Logo from './Logo.svg';

export const Home = () => {
    const animate: boolean = (sessionStorage.getItem('animate-logo') || 'true') === 'true';
    if (animate) sessionStorage.setItem('animate-logo', 'false');

    const {pathname} = useLocation();

    useEffect(() => {
        window.scroll(0, 0);
    }, [pathname]);

    return (
        <div className={'logo'}>
            <Logo className={animate ? 'animated' : 'static'}/>
        </div>
    );
};

window.addEventListener('beforeunload', () => sessionStorage.setItem('animate-logo', 'true'));