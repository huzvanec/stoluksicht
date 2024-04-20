import {
    AppBar,
    Box,
    Button,
    IconButton,
    IconButtonProps,
    MenuItem,
    Select,
    SelectChangeEvent,
    Tab,
    Tabs,
    Toolbar,
    Tooltip,
    TooltipProps,
    useColorScheme,
    Zoom
} from '@mui/material';
import {NavLink, useLocation,} from 'react-router-dom';
import React from 'react';
import './header.scss';
import {Mode} from '@mui/system/cssVars/useCurrentColorScheme';
import {useTranslation} from 'react-i18next';
import {currentLanguage} from '../i18n';
import {motion} from 'framer-motion';

interface TabItem {
    icon?: string;
    label: string;
    value: string;
}

export const Header = () => {
    const {i18n, t} = useTranslation();

    const navItems: TabItem[] = [
        {
            icon: 'fa-solid fa-house',
            label: t('home'),
            value: ''
        },
        {
            label: 'Calendar',
            value: 'cal',
        }
    ];

    // '/my/path/example/' -> 'my'
    let tab: string | false = useLocation().pathname.split('/')[1];

    const tabValues: string[] = navItems.map((item: TabItem) => item.value);
    if (!tabValues.includes(tab)) tab = false; // unselect tab menu

    const {mode, setMode} = useColorScheme();
    const next: Mode = mode === 'light' ? 'dark' : 'light';

    const changeLanguage = (event: SelectChangeEvent) => {
        const language: string = event.target.value;
        i18n.changeLanguage(language).then();
        localStorage.setItem('language', language);
    };

    return (
        <AppBar className={'app-bar menu'}>
            <Toolbar className={'toolbar'}>
                <Tabs value={tab} className={'tabs'}>
                    {navItems.map((item: TabItem) => (
                        <Tab className={'tab'}
                             label={<>
                                 {(item.icon)
                                     ? <i className={item.icon}/>
                                     : null}
                                 <span>{item.label}</span>
                             </>}
                             value={item.value}
                             key={item.value}
                             component={NavLink}
                             to={'/' + item.value}
                        />
                    ))},
                </Tabs>
                <Box sx={{flexGrow: 1}}/>
                <STooltip title={t('changeMode', {mode: t(next)})}
                          TransitionComponent={Zoom}
                          enterDelay={500}
                          enterNextDelay={500}
                          arrow
                >
                    <SIconButton
                        icon={'fa-solid fa-' + (mode === 'light' ? 'moon' : 'sun')}
                        onClick={() => setMode(next)}
                        className={'theme-changer'}
                    />
                </STooltip>
                <Select value={currentLanguage()}
                        size={'small'}
                        onChange={changeLanguage}
                >
                    <MenuItem value={'en'}>🇬🇧 EN</MenuItem>
                    <MenuItem value={'cz'}>🇨🇿 CZ</MenuItem>
                </Select>
                <Button variant={'outlined'}
                        component={NavLink}
                        to={'/log-in'}>
                    {t('logIn')}
                </Button>
                <Button variant={'contained'}
                        component={NavLink}
                        to={'/register'}>
                    {t('register')}
                </Button>
            </Toolbar>
        </AppBar>
    );
};

interface IButtonProps extends IconButtonProps {
    icon: string;
}

export const SIconButton: React.FC<IButtonProps> = ({icon, ...other}) => {
    return (
        <IconButton {...other}>
            <motion.i className={icon}
                      whileTap={{scale: 0.8, transition: {duration: 0.1}}}/>
        </IconButton>
    );
};

export const STooltip: React.FC<TooltipProps> = ({children, ...other}) => {
    return (
        <Tooltip TransitionComponent={Zoom}
                 enterDelay={500}
                 enterNextDelay={500}
                 arrow
                 {...other}
        >
            <div>
                {children}
            </div>
        </Tooltip>
    );
};