import {Route, Routes, useLocation} from 'react-router-dom';
import {Home} from './routes/home/Home';
import React, {HTMLAttributes} from 'react';
import {AnimatePresence, motion, MotionProps, Variants} from 'framer-motion';
import {LogIn} from './routes/log-in/LogIn';
import {Register} from './routes/register/Register';
import {Verify} from './routes/verify/Verify';
import {Menu} from './routes/menu/Menu';

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

    return (
        <AnimatePresence mode={'wait'}>
            <Routes location={location} key={location.key}>
                <Route index element={a(<Home/>)}/>
                <Route path={'/log-in'} element={a(<LogIn/>)}/>
                <Route path={'/register'} element={a(<Register/>)}/>
                <Route path={'/verify/*'} element={<Verify/>}>
                    <Route path={':code'} element={<Verify/>}/>
                    <Route index element={<Verify/>}/>
                </Route>
                <Route path={'/menu'} element={<Menu/>}/>
            </Routes>
        </AnimatePresence>
    );
};
