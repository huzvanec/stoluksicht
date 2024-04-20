import {Header} from './header/Header';
import {BrowserRouter as Router} from 'react-router-dom';
import React, {createContext, PropsWithChildren, useContext, useEffect, useState} from 'react';
import {
    Box,
    CircularProgress,
    CssBaseline,
    Experimental_CssVarsProvider as CssVarsProvider,
    experimental_extendTheme as extendTheme,
    StyledEngineProvider
} from '@mui/material';
import themeOptions from './theme';
import {AnimatedRoutes} from './AnimatedRouter';
import {SnackbarProvider, useSnackbar, VariantType} from 'notistack';
import {useTranslation} from 'react-i18next';

interface PageContextType {
    loading: boolean;
    setLoading: (newLoading: boolean) => void;
    snack: (message: string, type: VariantType) => void;
    apiSnack: (message: string, type?: VariantType) => void;
    mobile: boolean;
    setMobile: (newMobile: boolean) => void;
}

export const PageContext = createContext<PageContextType>({
    loading: false,
    setLoading: () => {
    },
    snack: () => {
    },
    apiSnack: () => {
    },
    mobile: false,
    setMobile: () => {
    }
});

export const usePage = () => useContext(PageContext);

type PageProviderProps = PropsWithChildren & {
    mobile: boolean;
    setMobile: (newMobile: boolean) => void;
}

export const PageProvider: React.FC<PageProviderProps> = ({children, mobile, setMobile}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [t, i18n] = useTranslation();

    i18n.on('languageChanged', () => closeSnackbar());

    const snack = (message: string, type: VariantType = 'default') => {
        enqueueSnackbar(message, {
            variant: type
        });
    };

    const apiSnack = (message: string, type: VariantType = 'error') => {
        if (!i18n.exists(message)) {
            snack(t('OTHER', {type: message}), type);
            return;
        }
        snack(t(message), type);
    };

    const value: PageContextType = {
        loading, setLoading, snack, apiSnack, mobile, setMobile
    };

    return (
        <>
            <PageContext.Provider value={value}>
                {children}
            </PageContext.Provider>
            {(loading)
                ? <Box className={'loading'}><CircularProgress/></Box>
                : undefined}
        </>
    );
};

export const Page = () => {
    const [mobile, setMobile] = useState<boolean>(isMobile());

    function isMobile(): boolean {
        return window.innerWidth <= 768;
    }

    function windowResize() {
        setMobile(isMobile());
    }

    useEffect(() => {
        window.addEventListener('resize', windowResize);
        return () => {
            window.removeEventListener('resize', windowResize);
        };
    }, []);

    return (
        <CssVarsProvider theme={extendTheme(themeOptions)}>
            <StyledEngineProvider injectFirst> {/* inject scss */}
                <CssBaseline/>
                <SnackbarProvider maxSnack={mobile ? 2 : 5}
                                  dense={mobile}
                                  autoHideDuration={8000}
                                  anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}>
                    <PageProvider mobile={mobile} setMobile={setMobile}>
                        <Router>
                            <Header/>
                            <div className={'main'}>
                                <AnimatedRoutes/>
                            </div>
                        </Router>
                    </PageProvider>
                </SnackbarProvider>
            </StyledEngineProvider>
        </CssVarsProvider>
    );
};