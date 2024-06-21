import {
    AppBar,
    Box,
    Button,
    ButtonProps,
    IconButton,
    IconButtonProps,
    Menu,
    MenuItem, ModalManager,
    PopoverOrigin,
    Select,
    SelectChangeEvent,
    SelectProps,
    SwipeableDrawer,
    Tab,
    Tabs,
    Toolbar,
    Tooltip,
    TooltipProps,
    useColorScheme,
    Zoom
} from '@mui/material';
import {NavLink, useLocation,} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import './header.scss';
import {Mode} from '@mui/system/cssVars/useCurrentColorScheme';
import {useTranslation} from 'react-i18next';
import {currentLanguage} from '../i18n';
import {TabsProps} from '@mui/material/Tabs/Tabs';
import {ArrowDropDown} from '@mui/icons-material';
import useStolu from '../provider/StoluProvider';
import {Renderer} from '../index';
import useApi from '../provider/ApiProvider';

interface TabItem {
    icon?: string;
    label: string;
    value: string;
}

export const Header = () => {
    const {mobile} = useStolu();
    const renderHeader: Renderer = () => {
        return mobile
            ? <MobileDrawer/>
            : <DesktopBar/>;
    };
    return (
        <>{renderHeader()}</>
    );
};

type ProfileMenuProps = {
    anchor: HTMLElement | null;
    close: () => void;
    anchorOrigin?: PopoverOrigin;
    transformOrigin?: PopoverOrigin;
};

const ProfileMenu: React.FC<ProfileMenuProps> = ({anchor, close, ...other}) => {
    const isOpen = !!anchor;
    const {apiCall, setToken} = useApi();
    const {setLoading} = useStolu();
    const [t] = useTranslation();

    const logOut = async () => {
        close();
        setLoading(true);
        const response = await apiCall(api => api.post('/log-out'));
        setLoading(false);
        if (response.state !== 'success') return;
        setToken(null);
    };

    return (
        <Menu {...other}
              open={isOpen}
              anchorEl={anchor}
              className={'profile-menu'}
              onClose={close}>
            <MenuItem onClick={logOut}>
                <i className={'fa-solid fa-right-from-bracket'}/>
                {t('logOut')}
            </MenuItem>
        </Menu>
    );
};

const DesktopBar: React.FC = () => {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const {token} = useApi();
    const renderProfile = (): React.JSX.Element => {
        if (token) {
            return (
                <>
                    <ProfileButton open={!!menuAnchor}
                                   onClick={(event) => setMenuAnchor(event.currentTarget)}/>
                    <ProfileMenu anchor={menuAnchor} close={() => setMenuAnchor(null)}/>
                </>
            );
        } else {
            return (
                <>
                    <LogInButton/>
                    <RegisterButton/>
                </>
            );
        }
    };
    return (
        <AppBar className={'app-bar menu'}>
            <Toolbar className={'toolbar'}>
                <Navigation/>
                <Box sx={{flexGrow: 1}}/>
                <ModeChanger/>
                <LanguageSelector/>
                {renderProfile()}
            </Toolbar>
        </AppBar>
    );
};

const popoverTop: { [key: string]: PopoverOrigin } = {
    anchorOrigin: {
        vertical: 'top',
        horizontal: 'left',
    },
    transformOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
    }
};

export const bleeding: number = 75; // the draggable area of the drawer in px
const MobileDrawer: React.FC = () => {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [buttonMenuAnchor, setButtonMenuAnchor] = useState<HTMLElement | null>(null);
    const closeMenu = () => {
        setMenuAnchor(null);
    };
    const openMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setMenuAnchor(event.currentTarget);
    };
    const [t] = useTranslation();
    const [open, setOpen] = useState<boolean>(false);

    const {token} = useApi();

    const close = () => setOpen(false);

    const renderProfile: Renderer = (): React.JSX.Element => {
        if (token) {
            return (
                <ProfileMenu anchor={menuAnchor}
                             close={closeMenu}
                             {...popoverTop}
                />
            );
        } else {
            return (
                <Menu open={!!menuAnchor}
                      onClick={closeMenu}
                      anchorEl={menuAnchor}
                      className={'profile-menu'}
                      onClose={closeMenu}
                      {...popoverTop}>
                    <MenuItem component={NavLink} to={'/log-in'} onClick={close}>
                        {t('logIn')}
                    </MenuItem>
                    <MenuItem component={NavLink} to={'/register'} onClick={close}>
                        {t('register')}
                    </MenuItem>
                </Menu>
            );
        }
    };

    const renderRight: Renderer = () => {
        if (token) {
            return (
                <>
                    <ProfileButton open={!!buttonMenuAnchor}
                                   onClick={(event) => setButtonMenuAnchor(event.currentTarget)}/>
                    <ProfileMenu anchor={buttonMenuAnchor} close={() => setButtonMenuAnchor(null)}/>
                </>
            );
        } else {
            return (
                <>
                    <LogInButton onClick={close}/>
                    <RegisterButton onClick={close}/>
                </>
            );
        }
    };
    return (
        <SwipeableDrawer className={'drawer mui-fixed'}
                         open={open}
                         anchor={'bottom'}
                         onClose={() => setOpen(false)}
                         onOpen={() => setOpen(true)}
                         swipeAreaWidth={bleeding}
                         disableSwipeToOpen={false}
                         allowSwipeInChildren={true}>
            <Box className={'puller menu'}
                 sx={{top: -(bleeding), height: `calc(${bleeding}px + .1svh)`}}>
                <StoluIconButton icon={'fa-solid fa-user'}
                                 onClick={openMenu}
                                 sx={{color: token ? 'var(--mui-palette-primary-main)' : undefined}}
                                 className={'avatar'}/>
                {renderProfile()}
                <Box className={'notch'}/>
                <StoluIconButton icon={'fa-solid fa-' + (open ? 'xmark' : 'bars')}
                                 onClick={() => setOpen(!open)}
                                 className={'burger'}/>
            </Box>
            <Box className={'content'}>
                <Box className={'panel'}>
                    <Navigation orientation={'vertical'}/>
                    <Box className={'right'}>
                        {renderRight()}
                    </Box>
                </Box>
                <Box className={'utils'}>
                    <ModeChanger/>
                    <LanguageSelector/>
                </Box>
            </Box>
        </SwipeableDrawer>
    );
};

interface ModeChangerProps {
    tooltipProps?: TooltipProps;
    buttonProps?: StoluIconButtonProps;
}

const ModeChanger: React.FC<ModeChangerProps> = ({tooltipProps, buttonProps}) => {
    const [t] = useTranslation();
    const {mode, setMode} = useColorScheme();
    const next: Mode = mode === 'light' ? 'dark' : 'light';
    const changeMode = () => {
        setMode(next);
        document.documentElement.style.colorScheme = next;
    };

    useEffect(() => {
        document.documentElement.style.colorScheme = mode as string;
    }, []);

    return (
        <StoluTooltip {...tooltipProps}
                      title={t('changeMode', {mode: t(next)})}
                      TransitionComponent={Zoom}
                      enterDelay={500}
                      enterNextDelay={500}
                      arrow>
            <StoluIconButton {...buttonProps}
                             icon={'fa-solid fa-' + (mode === 'light' ? 'moon' : 'sun')}
                             onClick={changeMode}
                             className={'theme-changer'}/>
        </StoluTooltip>
    );
};

const LanguageSelector: React.FC<SelectProps> = (_onChange, {className, ...other}) => {
    const i18n = useTranslation().i18n;

    const changeLanguage = (event: SelectChangeEvent) => {
        const language: string = event.target.value;
        i18n.changeLanguage(language).then();
        localStorage.setItem('language', language);
    };

    return (
        <Select value={currentLanguage()}
                size={'small'}
                className={'language-selector ' + className}
                onChange={changeLanguage}
                {...other}>
            <MenuItem value={'en'}>🇬🇧 EN</MenuItem>
            <MenuItem value={'cz'}>🇨🇿 CZ</MenuItem>
        </Select>
    );
};

const LogInButton: React.FC<ButtonProps> = ({className, ...other}) => {
    const [t] = useTranslation();

    return (
        <Button variant={'outlined'}
                component={NavLink}
                className={'header-button log-in-button ' + className}
                to={'/log-in'}
                {...other}>
            {t('logIn')}
        </Button>
    );
};

type ProfileButtonProps = ButtonProps & {
    open: boolean;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({open, className, ...other}) => {
    const [t] = useTranslation();

    return (
        <Button variant={'outlined'}
                className={'header-button profile-button ' + className}
                {...other}>
            <i className={'fa-solid fa-user'}/>
            <span>{t('myAccount')}</span>
            <ArrowDropDown sx={{rotate: open ? '180deg' : 0}}/>
        </Button>
    );
};

const RegisterButton: React.FC<ButtonProps> = ({className, ...other}) => {
    const [t] = useTranslation();
    return (
        <Button variant={'contained'}
                component={NavLink}
                to={'/register'}
                className={'header-button register-button ' + className}
                {...other}>
            {t('register')}
        </Button>
    );
};

const Navigation: React.FC<TabsProps> = ({className, ...other}) => {
    const [t] = useTranslation();

    const navItems: TabItem[] = [
        {
            icon: 'fa-solid fa-house',
            label: t('home'),
            value: ''
        },
        {
            icon: 'fa-solid fa-bowl-food',
            label: t('menu'),
            value: 'menu'
        }
    ];

    let tab: string | false = useLocation().pathname.split('/')[1];

    const tabValues: string[] = navItems.map((item: TabItem) => item.value);
    if (!tabValues.includes(tab)) tab = false; // unselect tab menu
    return (
        <Tabs value={tab} className={'tabs ' + className} {...other}>
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
    );
};


interface StoluIconButtonProps extends IconButtonProps {
    icon: string;
}

export const StoluIconButton: React.FC<StoluIconButtonProps> = ({icon, className, ...other}) => {
    return (
        <IconButton {...other} className={className + '-btn'}>
            <i tabIndex={-1} className={icon + ' ' + className}/>
        </IconButton>
    );
};

export const StoluTooltip: React.FC<TooltipProps> = ({children, ...other}) => {
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