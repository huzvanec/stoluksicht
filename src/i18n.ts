import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

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
            cz: {
                translation: {
                    home: 'Domů',
                    logIn: 'Přihlásit se',
                    register: 'Registrovat se',
                    dark: 'tmavý',
                    light: 'světlý',
                    changeMode: 'Změnit na {{mode}} režim',
                    username: 'Uživatelské jméno',
                    emailAddress: 'Emailová adresa',
                    password: 'Heslo',
                    alreadyHaveAccount: 'Máte již účet? Přihlaste se!',
                    usernameInvalid: 'Používejte pouze A-Z, a-z, 0-9, mezery, tečky, podtržítka a spojovníky.',
                    emailInvalid: 'Neplatná emailová adresa!',
                    short: '{{what}} musí mít alespoň {{length}} znaky!',
                    long: '{{what}} nesmí přesáhnout {{length}} znaků!',
                    fieldRequired: 'Toto pole je povinné!',
                    CONNECTION: 'Nepodařilo se spojit se Stolujeme API!',
                    OTHER: 'Došlo k neznámé chybě: {{type}}',
                    UNKNOWN: 'Došlo k neznámé chybě!',
                    NAME_NOT_UNIQUE: 'Toto jméno je již zabrané jiným uživatelem!'
                }
            },
            en: {
                translation: {
                    home: 'Home',
                    logIn: 'Log in',
                    register: 'Register',
                    dark: 'dark',
                    light: 'light',
                    changeMode: 'Change to {{mode}} mode',
                    username: 'Username',
                    emailAddress: 'Email address',
                    password: 'Password',
                    alreadyHaveAccount: 'Already have an account? Log in!',
                    usernameInvalid: 'Use only A-Z, a-z, 0-9, spaces, periods, underscores, and hyphens.',
                    emailInvalid: 'Invalid email address!',
                    short: '{{what}} must be at least {{length}} characters long!',
                    long: '{{what}} must not exceed {{length}} characters!',
                    fieldRequired: 'This field is required!',
                    CONNECTION: 'Could not connect to Stolujeme API!',
                    OTHER: 'An unknown error occurred: {{type}}',
                    UNKNOWN: 'An unknown error occurred!',
                    NAME_NOT_UNIQUE: 'This name is already taken by another user!'
                }
            }
        }
    }).then();

export default i18n;