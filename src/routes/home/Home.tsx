import './home.scss';
import React from 'react';
import Logo from './Logo.svg';

export const Home = () => {
    const animate: boolean = (sessionStorage.getItem('animate-logo') || 'true') === 'true';
    if (animate) sessionStorage.setItem('animate-logo', 'false');

    return (
        <div className={'logo'}>
            <Logo className={animate ? 'animated' : 'static'}/>
        </div>
    );
};

window.addEventListener('beforeunload', () => sessionStorage.setItem('animate-logo', 'true'));