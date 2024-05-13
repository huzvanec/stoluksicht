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
                    // routes
                    home: 'Domů',
                    logIn: 'Přihlásit se',
                    register: 'Registrovat se',
                    menu: 'Jídelníček',
                    // themes
                    dark: 'tmavý',
                    light: 'světlý',
                    changeMode: 'Změnit na {{mode}} režim',
                    // register
                    username: 'Uživatelské jméno',
                    emailAddress: 'Emailová adresa',
                    password: 'Heslo',
                    alreadyHaveAccount: 'Máš již účet? Přihlaš se!',
                    usernameInvalid: 'Používej pouze A-Z, a-z, 0-9, mezery, tečky, podtržítka a spojovníky.',
                    emailInvalid: 'Neplatná emailová adresa!',
                    // errors
                    short: '{{what}} musí mít alespoň {{length}} znaky!',
                    long: '{{what}} nesmí přesáhnout {{length}} znaků!',
                    fieldRequired: 'Toto pole je povinné!',
                    CONNECTION: 'Nepodařilo se spojit se Stolujeme API!',
                    OTHER: 'Došlo k neznámé chybě: {{type}}',
                    UNKNOWN: 'Došlo k neznámé chybě!',
                    NAME_NOT_UNIQUE: 'Toto jméno je již zabrané jiným uživatelem!',
                    // verification email sent
                    verifySend: 'Ověření',
                    verifyInfo: 'Na tvoji e-mailovou adresu jsme zaslali ověřovací e-mail. Kliknutím na odkaz v e-mailu ověříš svůj účet.',
                    verifyExpire: 'Tvoje ověření vyprší za {{minutes}}:{{seconds}}',
                    verifyResend: 'Znovu odeslat ověření',
                    verifyExpired: 'Tvoje ověření vypršelo!',
                    verify: 'Ověřit účet',
                    // account verification
                    verifySuccess: 'Účet ověřen!',
                    verifySuccessInfo: 'Nyní se můžeš přihlásit.',
                    verifyError: 'Něco se nezdařilo!',
                    verifyErrorInfo: 'Tento odkaz je buď neplatný nebo ověření již vypršelo. Zkus se prosím zaregistrovat znovu.',
                    verifyProgress: 'Ověřování...',
                    verifyProgressInfo: 'Ověřujeme tvůj účet...',
                    // log in
                    forgottenPassword: 'Forgornuté heslo? 💀',
                    dontHaveAccount: 'Ještě nemáš účet? Registruj se!',
                    // console warning
                    consoleWarning1: 'ZASTAV TY KONĚ!',
                    consoleWarning2: 'Pokud ti někdo řekl, abys sem něco vložil/a, na 150 % je to scam!',
                    consoleWarning3: 'Pokud sem cokoliv vložíš, můžeš tím útočníkům poskytnout přístup ke svému účtu!',
                    consoleContribute: 'Pokud víš co děláš a toto varování není pro tebe, budeme rádi za příspěvek! Stolujeme je plnně open-source!',
                    // account
                    myAccount: 'Můj účet',
                    logOut: 'Odhlásit se',
                    // menu
                    soup: 'Polévka',
                    addition: 'Doplňek',
                    personalRating: 'Osobní hodnocení',
                    globalRating: 'Celoškolní hodnocení',
                    monday: 'Pondělí',
                    tuesday: 'Úterý',
                    wednesday: 'Středa',
                    thursday: 'Čtvrtek',
                    friday: 'Pátek',
                    saturday: 'Sobota',
                    sunday: 'Neděle',
                    float: ',',
                    // footer
                    openSource: 'Stolujeme je <0/>',
                    licence: 'Licencováno pod <0/>',
                    disclaimer: 'STOLUJEME NENÍ OFICIÁLNÍM PRODUKTEM STRAVY. NENÍ SCHVÁLENO ANI SPOJENO SE <0/> NEBO <1/>.',
                    reportBug: 'Nahlásit chybu',
                    requestFeature: 'Navrhnout featuru'
                }
            },
            en: {
                translation: {
                    // routes
                    home: 'Home',
                    logIn: 'Log in',
                    register: 'Register',
                    menu: 'Menu',
                    // themes
                    dark: 'dark',
                    light: 'light',
                    changeMode: 'Change to {{mode}} mode',
                    // register
                    username: 'Username',
                    emailAddress: 'Email address',
                    password: 'Password',
                    alreadyHaveAccount: 'Already have an account? Log in!',
                    usernameInvalid: 'Use only A-Z, a-z, 0-9, spaces, periods, underscores, and hyphens.',
                    emailInvalid: 'Invalid email address!',
                    // errors
                    short: '{{what}} must be at least {{length}} characters long!',
                    long: '{{what}} must not exceed {{length}} characters!',
                    fieldRequired: 'This field is required!',
                    CONNECTION: 'Could not connect to Stolujeme API!',
                    OTHER: 'An unknown error occurred: {{type}}',
                    UNKNOWN: 'An unknown error occurred!',
                    NAME_NOT_UNIQUE: 'This name is already taken by another user!',
                    // verification email sent
                    verifySend: 'Verification',
                    verifyInfo: 'We have sent a verification email to your email address. Click the link in the email to verify your account.',
                    verifyExpire: 'Your verification will expire in {{minutes}}:{{seconds}}',
                    verifyResend: 'Resend verification',
                    verifyExpired: 'Your verification has expired!',
                    // account verification
                    verifySuccess: 'Account verified!',
                    verifySuccessInfo: 'You may now log in.',
                    verifyError: 'Something went wrong!',
                    verifyErrorInfo: 'This link is either invalid or the verification has already expired. Please try to register again.',
                    verifyProgress: 'Verifying...',
                    verifyProgressInfo: 'We are verifying your account...',
                    // log in
                    forgottenPassword: 'Forgor password? 💀',
                    dontHaveAccount: 'Don\'t have an account? Register now!',
                    // console warning
                    consoleWarning1: 'STOP YOUR HORSES!',
                    consoleWarning2: 'If someone told you to paste something in here, it\'s 150% a scam!',
                    consoleWarning3: 'If you paste anything here, you can give attackers access to your account!',
                    consoleContribute: 'If you know what you\'re doing and this warning isn\'t for you, contributions are welcome! Stolujeme is fully open-source!',
                    // account
                    myAccount: 'My account',
                    logOut: 'Log out',
                    // menu
                    soup: 'Soup',
                    addition: 'Addition',
                    personalRating: 'Personal rating',
                    globalRating: 'School-wide rating',
                    monday: 'Monday',
                    tuesday: 'Tuesday',
                    wednesday: 'Wednesday',
                    thursday: 'Thursday',
                    friday: 'Friday',
                    saturday: 'Saturday',
                    sunday: 'Sunday',
                    float: '.',
                    // footer
                    openSource: 'Stolujeme is <0/>',
                    licence: 'Licenced under <0/>',
                    disclaimer: 'STOLUJEME IS NOT AN OFFICIAL STRAVA PRODUCT. NOT APPROVED BY OR AFFILIATED WITH <0/> OR <1/>.',
                    reportBug: 'Report a bug',
                    requestFeature: 'Suggest a feature'
                }
            }
        }
    }).then();

export default i18n;