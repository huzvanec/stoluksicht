import './home.scss';
import React from 'react';

export const Home = () => {
    const animate: boolean = (sessionStorage.getItem('animate-logo') || 'true') === 'true';
    if (animate) sessionStorage.setItem('animate-logo', 'false');
    return (
        <div className={'logo'}>
            <svg className={animate ? 'animated' : 'static'}>
                <text x="50%" y="50%">
                    STOLUJEME
                </text>
            </svg>
        </div>
    );
};

window.addEventListener('beforeunload', () => sessionStorage.setItem('animate-logo', 'true'));