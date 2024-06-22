import {Header} from '../header/Header.tsx';
import {BrowserRouter as Router} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {
    CssBaseline,
    Experimental_CssVarsProvider as CssVarsProvider,
    experimental_extendTheme as extendTheme,
    StyledEngineProvider
} from '@mui/material';
import themeOptions from '../theme.ts';
import {AnimatedRoutes} from '../Router.tsx';
import {SnackbarProvider} from 'notistack';
import {useTranslation} from 'react-i18next';
import {StoluProvider} from '../provider/StoluProvider.tsx';
import {ApiProvider} from '../provider/ApiProvider.tsx';
import {Footer} from '../footer/Footer.tsx';

const consoleWarning: boolean = false;

export const Page = () => {
    const [t] = useTranslation();

    const isMobile = (): boolean => window.innerWidth <= 1000;
    const [mobile, setMobile] = useState<boolean>(isMobile());

    useEffect(() => {
        const onWindowResize = (): void => setMobile(isMobile());
        window.addEventListener('resize', onWindowResize);
        return () => {
            window.removeEventListener('resize', onWindowResize);
        };
    }, []);

    //<editor-fold defaultstate="collapsed" desc="consoleWarnings">
    useEffect(() => {
        if (!consoleWarning) return;
        console.clear();
        const cssConsole = (msg: string, css: string) => {
            console.log(`%c${msg}`, css);
        };
        cssConsole(
            t('consoleWarning1'),
            `
            color: red;
            font-weight: bold;
            font-size: 100px;
            `
        );
        cssConsole(
            t('consoleWarning2'),
            `
            color: aqua;
            font-weight: bold;
            font-size: 50px;
            `
        );
        cssConsole(
            t('consoleWarning3'),
            `
            color: orange;
            font-weight: bold;
            font-size: 30px;
            `
        );
        cssConsole(
            t('consoleContribute'),
            `
            font-size: 15px;
            color: pink;
            font-weight: bold;
            `
        );
        cssConsole('https://github.com/Mandlemankiller/StolujemeAPI', 'font-size: 15px');
        cssConsole('https://github.com/Mandlemankiller/stolujeme-ksicht', 'font-size: 15px');
    }, [t]);
    //</editor-fold>

    return (
        <CssVarsProvider theme={extendTheme(themeOptions)}>
            <StyledEngineProvider injectFirst> {/* inject scss */}
                <CssBaseline/>
                <SnackbarProvider maxSnack={mobile ? 2 : 5}
                                  dense={mobile}
                                  autoHideDuration={8000}
                                  anchorOrigin={{
                                      vertical: mobile ? 'top' : 'bottom',
                                      horizontal: 'left'
                                  }}>
                    <StoluProvider mobile={mobile}>
                        <ApiProvider>
                            <Router>
                                <div className={'bg'}/>
                                <Header/>
                                <main style={{minHeight: mobile ? '100svh' : 'calc(100svh - 85px)'}}>
                                    <AnimatedRoutes/>
                                </main>
                                <Footer/>
                            </Router>
                        </ApiProvider>
                    </StoluProvider>
                </SnackbarProvider>
            </StyledEngineProvider>
        </CssVarsProvider>
    );
};