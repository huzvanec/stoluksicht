import {Route, Routes, useLocation} from 'react-router-dom';
import {Home} from './routes/home/Home';
import React, {HTMLAttributes, useEffect} from 'react';
import {AnimatePresence, motion, MotionProps, Variants} from 'framer-motion';
import {LogIn} from './routes/log-in/LogIn';
import {Register} from './routes/register/Register';
import {Verify} from './routes/verify/Verify';
import {Menu} from './routes/menu/Menu';
import Meal, {M} from './routes/meal/Meal';
import NotFound from './routes/404/NotFound';
import RequireAuth from './component/RequireAuth';

// animation
export const variants: Variants = {
    initial: {
        scale: .95,
        opacity: 0,
        y: '1vh'
    },
    final: {
        scale: 1,
        y: 0,
        opacity: 1
    },
    exit: {
        scale: .95,
        opacity: 0,
        y: '1vh',
        transition: {duration: .1}
    }
};

export const animation: MotionProps & HTMLAttributes<any> = {
    className: 'motion',
    variants: variants,
    initial: 'initial',
    animate: 'final',
    exit: 'exit'
};

// animation wrapper
export const a = (child: React.JSX.Element, state?: any): React.JSX.Element => {
    return (
        <motion.div key={state} {...animation}>
            {child}
        </motion.div>
    );
};

export const AnimatedRoutes = () => {
    const location = useLocation();

    useEffect(() => {
        window.scroll({top: 0, behavior: 'smooth'});
    }, [location]);

    return (
        <AnimatePresence mode={'wait'}>
            <Routes location={location} key={location.key}>
                <Route index element={a(<Home/>)}/>
                <Route path={'/log-in'} element={a(<LogIn/>)}/>
                <Route path={'/register'} element={a(<Register/>)}/>
                <Route path={'/verify/*'}>
                    <Route index element={<NotFound/>}/>
                    <Route path={':code'} element={<Verify/>}/>
                </Route>
                <Route path={'/meal/*'}>
                    <Route index element={<NotFound/>}/>
                    <Route path={':uuid'} element={<RequireAuth>{a(<Meal/>)}</RequireAuth>}/>
                </Route>
                <Route path={'/m/*'}>
                    <Route index element={<NotFound/>}/>
                    <Route path={':uuid'} element={<M/>}/>
                </Route>
                <Route path={'/menu'} element={a(<Menu/>)}/>
            </Routes>
        </AnimatePresence>
    );
};
