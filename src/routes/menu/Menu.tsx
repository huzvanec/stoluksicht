import React, {ReactNode, useEffect, useState} from 'react';
import {Box, Rating, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import './menu.scss';
import useStolu from '../../provider/StoluProvider';
import {StoluTooltip} from '../../header/Header';
import {useNavigate} from 'react-router-dom';
import {grey} from '@mui/material/colors';
import useApi, {AnyData, SuccessResponse} from '../../provider/ApiProvider.tsx';
import {MealData} from '../meal/Meal.tsx';
import {Renderer} from '../../main.tsx';
import {Helmet} from 'react-helmet';

const weekDayFormatter = new Intl.DateTimeFormat('en-US', {weekday: 'long'});

interface MenuMealData extends MealData {
    mealUuid: string,
    menuUuid: string,
    courseNumber: number | null,
    currentRating: number | null
}

type MenuDayData = MenuMealData[];
type MenuData = Map<Date, MenuDayData>;

export const Menu: React.FC = () => {
    const {mobile} = useStolu();
    const {apiCall} = useApi();
    const [menuData, setMenuData] = useState<MenuData>();
    const [t] = useTranslation();

    const getMenu = async () => {
        const response = await apiCall(api => api.get('/menu'));
        if (response.state !== 'success') return;
        const menu: { [key: string]: AnyData[] } = (response.response as SuccessResponse).content.menu;
        const menuDataTemp: MenuData = new Map;
        for (const [dateStr, dayEntries] of Object.entries(menu)) {
            const date: Date = new Date(dateStr);
            const dayData: MenuDayData = [];
            for (const dayEntry of dayEntries) {
                const mealData: MenuMealData = {
                    name: dayEntry.name,
                    courseNumber: dayEntry.courseNumber,
                    menuUuid: dayEntry.uuid,
                    mealUuid: dayEntry.meal.uuid,
                    course: dayEntry.meal.course,
                    description: dayEntry.meal.description,
                    userRating: dayEntry.meal.ratings.user,
                    globalRating: dayEntry.meal.ratings.global,
                    currentRating: dayEntry.currentRating
                };
                dayData.push(mealData);
            }
            menuDataTemp.set(date, dayData);
        }
        setMenuData(menuDataTemp);
    };

    useEffect(() => {
        getMenu();
    }, []);

    const renderMenu: Renderer = () => {
        if (!menuData) return null;
        const days: ReactNode[] = [];
        for (const [date, dayData] of menuData.entries()) {
            days.push(<MenuDay key={date.toString()} date={date} data={dayData} reload={getMenu}/>);
        }
        return days;
    };

    return (
        <>
            <Helmet title={t('menu')}/>
            <Box className={'menu-container'}>
                <Box className={'menu-meals'}
                     sx={{
                         marginTop: (mobile ? 5 : 3) + 'svh'
                     }}>
                    {renderMenu()}
                </Box>
            </Box>
        </>
    );
};

interface MenuDayProps {
    date: Date;
    data: MenuDayData;
    reload: () => void;
}


const MenuDay: React.FC<MenuDayProps> = ({date, data, reload}) => {
    const [t] = useTranslation();

    const daysBetweenDates = (date1: Date, date2: Date): number => {
        const timeDifference = date2.getTime() - date1.getTime();
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const dayDifference = timeDifference / millisecondsPerDay;
        return Math.floor(dayDifference);
    };

    const formatDate = (date: Date): string => {
        return t('dateFormat', {
            day: date.getDate(),
            month: date.getMonth() + 1, // counted from zero
            year: date.getFullYear()
        });
    };


    const ratingDisabled: boolean = daysBetweenDates(date, new Date()) > 7;

    return (
        <Box className={'menu-day menu'}>
            <Typography className={'title'}
                        variant={'h4'}>
                {t(weekDayFormatter.format(date).toLowerCase())}
                {' '}
                {formatDate(date)}
            </Typography>
            {data.map(mealData => <Meal key={mealData.menuUuid}
                                        data={mealData}
                                        reload={reload}
                                        ratingDisabled={ratingDisabled}/>)}
        </Box>
    );
};


interface MealRatingProps {
    icon: string;
    rating: number | null;
    className?: string;
    tooltip: string;
}

const MealRating: React.FC<MealRatingProps> = ({icon, rating, className, tooltip}) => {
    return (
        <StoluTooltip title={tooltip}
                      className={'rating-tooltip'}
                      enterTouchDelay={0}>
            <span className={'rating ' + (className ?? '')}>
                <i className={'rating-icon ' + icon}/>
                {rating?.toFixed(1) ?? <Typography sx={{color: grey[500]}}>—</Typography>}
                <i className={'rating-star fa-solid fa-star'}/>
            </span>
        </StoluTooltip>
    );
};

interface MealProps {
    data: MenuMealData;
    reload: () => void;
    ratingDisabled: boolean;
}

const Meal: React.FC<MealProps> = ({data, reload, ratingDisabled}) => {
    const [t] = useTranslation();
    const type = t(data.course.toLowerCase()) + (data.courseNumber ? ' ' + data.courseNumber : '');
    const navigate = useNavigate();
    const {apiCall} = useApi();

    const handleOpen = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        if (!(event.target as HTMLElement).classList.contains('meal-opener')) return;
        navigate('/meal/' + data.mealUuid);
    };

    const rate = async (newRating: number | null) => {
        if (newRating == null) return;
        await apiCall(api => api.put(`/menu/${data.menuUuid}/rating`, {
            rating: newRating
        }));
        reload();
    };

    return (
        <Box className={'meal meal-opener'} onClick={handleOpen}>
            <Typography className={'type meal-opener'}
                        variant={'h6'}>
                {type}
            </Typography>
            <Typography className={'name meal-opener'}>
                {data.name}
            </Typography>
            <Box className={'rating-box meal-opener'}>
                {/*<Rating icon={<i className={'fa-solid fa-utensils'}/>}/>*/}
                <Box>
                    <StoluTooltip title={ratingDisabled ? t('menuOld') : ''}>
                        <Rating value={data.currentRating}
                                disabled={ratingDisabled}
                                onChange={(_event, value) => rate(value)}/>
                    </StoluTooltip>
                </Box>
                <Box className={'ratings'}>
                    <MealRating rating={data.userRating} icon={'fa-solid fa-user'} tooltip={t('personalRating')}/>
                    <MealRating rating={data.globalRating} icon={'fa-solid fa-users'} tooltip={t('globalRating')}/>
                </Box>
            </Box>
        </Box>
    );
};