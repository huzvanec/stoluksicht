import './home.scss';
import Logo from './Logo.svg';
import {Helmet} from 'react-helmet';

export const Home = () => {
    const animate: boolean = (sessionStorage.getItem('animate-logo') || 'true') === 'true';
    if (animate) sessionStorage.setItem('animate-logo', 'false');

    return (
        <>
            <Helmet title={'Stolujeme'}/>
            <div className={'logo'}>
                <Logo className={animate ? 'animated' : 'static'}/>
            </div>
        </>
    );
};

window.addEventListener('beforeunload', () => sessionStorage.setItem('animate-logo', 'true'));