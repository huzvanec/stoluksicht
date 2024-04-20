import {Route, Routes, useLocation} from 'react-router-dom';
import {Home} from './routes/home/Home';
import React from 'react';
import {Calendar} from './routes/calendar/Calendar';
import {AnimatePresence, motion, Variants} from 'framer-motion';
import {LogIn} from './routes/log-in/LogIn';
import {Register} from './routes/register/Register';

// animation
const variants: Variants = {
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

// animation route wrapper
const a = (child: React.ReactNode): React.ReactNode => {
    return (
        <motion.div className={'motion'}
                    variants={variants}
                    initial={'initial'}
                    animate={'final'}
                    exit={'exit'}>
            {child}
        </motion.div>
    );
};

export const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode={'wait'}>
            <Routes location={location} key={location.key}>
                <Route path={'/'} element={a(<Home/>)}/>
                <Route path={'/cal'} element={a(<Calendar/>)}/>
                <Route path={'/log-in'} element={a(<LogIn/>)}/>
                <Route path={'/register'} element={a(<Register/>)}/>
            </Routes>
        </AnimatePresence>
    );
};
