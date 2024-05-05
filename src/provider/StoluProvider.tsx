import {useSnackbar, VariantType} from 'notistack';
import React, {createContext, PropsWithChildren, useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Box, CircularProgress} from '@mui/material';
import {Renderer} from '../index';

export type Setter<T> = (value: T) => void;
export type SnackFunction = (message: string, type?: VariantType) => void;

interface StoluContextType {
    loading: boolean;
    setLoading: Setter<boolean>;
    snack: SnackFunction;
    mobile: boolean;
}

export const StoluContext = createContext<StoluContextType>({
    loading: false,
    setLoading: () => {
    },
    snack: () => {
    },
    mobile: false
});

const useStolu = () => useContext(StoluContext);
export default useStolu;

type StoluProviderProps = PropsWithChildren & {
    mobile: boolean;
}
export const StoluProvider: React.FC<StoluProviderProps> = ({children, mobile}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const i18n = useTranslation().i18n;

    i18n.on('languageChanged', () => closeSnackbar());

    const snack: SnackFunction = (message: string, type: VariantType = 'default') => {
        enqueueSnackbar(message, {
            variant: type
        });
    };

    // const apiSnack = (message: string, type: VariantType = 'error') => {
    //     if (!i18n.exists(message)) {
    //         snack(t('OTHER', {type: message}), type);
    //         return;
    //     }
    //     snack(t(message), type);
    // };

    const renderLoading: Renderer = () => {
        if (!loading) return;
        return (
            <Box className={'loading'}>
                <CircularProgress/>
            </Box>
        );
    };

    const value: StoluContextType = {loading, setLoading, snack, mobile};

    return (
        <>
            <StoluContext.Provider value={value}>
                {children}
            </StoluContext.Provider>
            {renderLoading()}
        </>
    );
};