import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import cz from './assets/lang/cz.json';
import en from './assets/lang/en.json';

export const currentLanguage = (): string => {
    return localStorage.getItem('language') || 'en';
};

i18n.use(initReactI18next)
    .init({
        lng: currentLanguage(),
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        resources: {
            cz: {translation: cz},
            en: {translation: en}
        }
    }).then();

export default i18n;