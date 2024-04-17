import {AppBar, Box, Button, IconButton, IconButtonProps, Tab, Tabs, Toolbar, useTheme} from '@mui/material';
import {NavLink, useLocation,} from 'react-router-dom';
import React from 'react';
import {PaletteModeChildProps} from './Page';
import './navigation.scss';

interface TabItem {
    label: string;
    value: string;
}

const navItems: TabItem[] = [
    {
        label: 'Home',
        value: ''
    },
    {
        label: 'Calendar',
        value: 'cal'
    }
];

export const Navigation: React.FC<PaletteModeChildProps> = ({paletteMode, setPaletteMode}) => {
    let tab: string | null = useLocation().pathname
        .split('/')
        .filter((point: string): boolean => point !== '')
        .join('/'); // '/my/path/' -> 'my/path'

    const tabValues: string[] = navItems.map((item: TabItem) => item.value);
    if (!tabValues.includes(tab)) tab = null; // unselect tab menu

    const theme = useTheme();

    return (
        <>
            <AppBar className={'app-bar'} sx={{backgroundColor: theme.palette.background.paper}}>
                <Toolbar className={'toolbar'}>
                    <Tabs value={tab}>
                        {navItems.map((item: TabItem) => (
                            <Tab label={item.label}
                                 value={item.value}
                                 key={item.value}
                                 component={NavLink}
                                 to={'/' + item.value}
                                 sx={{
                                     borderRadius: 2
                                 }}
                            />
                        ))},
                    </Tabs>
                    <Box sx={{flexGrow: 1}}/>
                    <IButton
                        icon={'fa-solid fa-' + (paletteMode === 'light' ? 'moon' : 'sun')}
                        onClick={() => setPaletteMode(paletteMode === 'light' ? 'dark' : 'light')}
                        className={'theme-changer'}
                    />
                    <Button variant={'outlined'}>
                        Log In
                    </Button>
                    <Button variant={'contained'}>
                        Sign Up
                    </Button>
                </Toolbar>
            </AppBar>
        </>
    );
};

interface IButtonProps extends IconButtonProps {
    icon: string;
}

export const IButton: React.FC<IButtonProps> = ({icon, ...other}) => {
    return (
        <IconButton {...other}>
            <i className={icon}/>
        </IconButton>
    );
};