import {useSnackbar, VariantType} from 'notistack';
import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useEffect,
    useState
} from 'react';
import {useTranslation} from 'react-i18next';
import Loading from '../component/Loading.tsx';

export type SnackFunction = (message: string, type?: VariantType) => void;

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<UserChoice>;
}

interface UserChoice {
    outcome: 'accepted' | 'dismissed';
    platform: string;
}

interface StoluContextType {
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    snack: SnackFunction;
    mobile: boolean;
    installPrompt?: BeforeInstallPromptEvent;
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
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | undefined>();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const i18n = useTranslation().i18n;

    i18n.on('languageChanged', () => closeSnackbar());

    const snack: SnackFunction = (message: string, type: VariantType = 'default') => {
        enqueueSnackbar(message, {
            variant: type
        });
    };

    const beforeInstallPrompt = (event: Event) => setInstallPrompt(event as BeforeInstallPromptEvent);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', beforeInstallPrompt);
        return () => {
            window.removeEventListener('beforeinstallprompt', beforeInstallPrompt);
        };
    }, []);

    const value: StoluContextType = {loading, setLoading, snack, mobile, installPrompt};

    return (
        <>
            <StoluContext.Provider value={value}>
                {children}
            </StoluContext.Provider>
            {(loading) ? <Loading/> : null}
        </>
    );
};