import {Color} from '@mui/material';
import {CssVarsThemeOptions} from '@mui/material/styles/experimental_extendTheme';
import {grey, red} from '@mui/material/colors';

export const granny_smith_apple: Color = {
    50: '#e8f7e6',
    100: '#c9eac3',
    200: '#a6dd9c',
    300: '#83d075',
    400: '#6ac45a',
    500: '#53b93d',
    600: '#49aa34',
    700: '#3d9729',
    800: '#31861f',
    900: '#1b670c',
    A100: '#ddebc3',
    A200: '#c6dd9c',
    A400: '#9fc657',
    A700: '#6a9927',
};


export const palm_leaf: Color = {
    50: '#e5efe4',
    100: '#c1d8be',
    200: '#9abe95',
    300: '#74a76e',
    400: '#5a9652',
    500: '#418636',
    600: '#39782f',
    700: '#2f6826',
    800: '#26581e',
    900: '#163b10',
    A100: '#cbd7bb',
    A200: '#abbd91',
    A400: '#77954c',
    A700: '#4d6721',
};

export const caper: Color = {
    50: '#f1faea',
    100: '#dbf3ca',
    200: '#c4eba8',
    300: '#ace286',
    400: '#9adb6b',
    500: '#89d452',
    600: '#7ac34a',
    700: '#65ae40',
    800: '#529a36',
    900: '#2e7725',
    A100: '#eff2ca',
    A200: '#e5eba8',
    A400: '#d4dd68',
    A700: '#aeb040',
};

export const clover: Color = {
    50: '#eaf3e6',
    100: '#cde1c2',
    200: '#aecf9c',
    300: '#90bd76',
    400: '#7ab059',
    500: '#66a23d',
    600: '#5c9435',
    700: '#4f832b',
    800: '#447223',
    900: '#2f5414',
    A100: '#e8e3c1',
    A200: '#d8d19a',
    A400: '#bcb357',
    A700: '#89862a',
};

export const texas: Color = {
    50: '#fdfce5',
    100: '#faf7be',
    200: '#f6f193',
    300: '#f2eb68',
    400: '#efe746',
    500: '#ece21e',
    600: '#eed118',
    700: '#edb909',
    800: '#eca100',
    900: '#ea7800',
    A100: '#fad8bc',
    A200: '#f6c093',
    A400: '#f5924c',
    A700: '#e46737',
};

export const bronze_olive: Color = {
    50: '#f6f1e4',
    100: '#e8ddbd',
    200: '#d6c693',
    300: '#c5b16a',
    400: '#b8a24c',
    500: '#ab942e',
    600: '#9a8727',
    700: '#84761e',
    800: '#6e6416',
    900: '#494609',
    A100: '#e3c4a9',
    A200: '#c29f81',
    A400: '#88613c',
    A700: '#563311',
};
const themeOptions: CssVarsThemeOptions = {
    colorSchemes: {
        light: {
            palette: {
                primary: palm_leaf,
                secondary: clover,
                error: red,
                text: {
                    primary: '#000',
                    secondary: grey[900],
                    disabled: grey[500]
                },
                background: {
                    paper: '#EEE',
                    default: '#DDD'
                }
            }
        },
        dark: {
            palette: {
                primary: granny_smith_apple,
                secondary: caper,
                error: red,
                text: {
                    primary: '#fff',
                    secondary: grey[200],
                    disabled: grey[500]
                },
                background: {
                    default: '#1C1E2A',
                    paper: '#14141D'
                }
            }
        }
    },
    typography: {
        fontFamily: [
            'Changa',
            'Arial',
            'sans-serif'
        ].join(','),
        overline: {
            fontSize: 16,
            color: grey[400]
        }
    }
};

export default themeOptions;