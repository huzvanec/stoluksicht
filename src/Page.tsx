import {Navigation} from './Navigation';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Root} from './routes/Root';
import {ThemeOptions} from '@mui/material/styles/createTheme';
import {grey, red} from '@mui/material/colors';
import React, {useState} from 'react';
import {createTheme, CssBaseline, PaletteMode, StyledEngineProvider, Theme, ThemeProvider} from '@mui/material';
import {bronze_olive, caper, clover, granny_smith_apple, palm_leaf, texas} from './colors';

export interface PaletteModeChildProps {
    paletteMode: PaletteMode;
    setPaletteMode: (newPaletteMode: PaletteMode) => void;
}

export const Page = () => {
    const [paletteMode, setPaletteMode] = useState<PaletteMode>('light');

    const theme: Theme = React.useMemo(() => createTheme(getDesignTokens(paletteMode)), [paletteMode]);

    return (

        <ThemeProvider theme={theme}>
            <StyledEngineProvider injectFirst> {/* inject sass */}
                <CssBaseline/>
                <Router>
                    <Navigation paletteMode={paletteMode} setPaletteMode={setPaletteMode}/>
                    <Routes>
                        <Route path={'/'} element={<Root/>}/>
                    </Routes>
                </Router>
            </StyledEngineProvider>
        </ThemeProvider>
    );
};

const getDesignTokens = (themeMode: PaletteMode): ThemeOptions => ({
    palette: {
        mode: themeMode,
        ...(themeMode === 'light'
                ? {
                    primary: granny_smith_apple,
                    secondary: caper,
                    error: red,
                    accent: texas,
                    text: {
                        primary: '#000',
                        secondary: grey[900],
                        disabled: grey[500]
                    },
                    background: {
                        paper: '#F9FAFE',
                        default: '#cbcbcb'
                    }
                }
                : {
                    primary: palm_leaf,
                    secondary: clover,
                    error: red,
                    accent: bronze_olive,
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
        )
    },
    typography: {
        fontFamily: [
            'Changa',
            'Arial',
            'sans-serif'
        ].join(',')
    }
});