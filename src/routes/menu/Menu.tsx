import React from 'react';
import {Box, Rating, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import './menu.scss';
import useStolu from '../../provider/StoluProvider';
import {StoluTooltip} from '../../header/Header';
import {useNavigate} from 'react-router-dom';

const weekdayFormatter = new Intl.DateTimeFormat('en-US', {weekday: 'long'});

export const Menu: React.FC = () => {
    const {mobile} = useStolu();
    return (
        <Box className={'menu-container'}>
            <Box className={'menu-meals'}
                 sx={{
                     marginTop: (mobile ? 5 : 3) + 'svh'
                 }}>
                <MenuDay date={new Date('2024-05-07')}/>
                <MenuDay date={new Date('2024-05-13')}/>
            </Box>
        </Box>
    );
};

interface MenuDayProps {
    date: Date;
}


const MenuDay: React.FC<MenuDayProps> = ({date}) => {
    const [t] = useTranslation();

    const formatDate = (date: Date): string => {
        return t('dateFormat', {
            day: date.getDay(),
            month: date.getMonth() + 1, // counted from zero
            year: date.getFullYear()
        });
    };

    return (
        <Box className={'menu-day menu'}>
            <Typography className={'title'}
                        variant={'h4'}>
                {t(weekdayFormatter.format(date).toLowerCase())}
                {' '}
                {formatDate(date)}
            </Typography>
            <Meal uuid={'5031a2b4-522f-4ce3-8b3d-4385c6ed2ea9'}
                  course={'soup'}
                  courseNumber={null}
                  description={null}
                  name={'Krémová s vločkami na želé'}
                  globalRating={null}
                  userRating={null}/>
            <Meal uuid={'5031a2b4-522f-4ce3-8b3d-4385c6ed2ea9'}
                  course={'main'}
                  courseNumber={1}
                  description={null}
                  name={'Řízel'}
                  globalRating={null}
                  userRating={null}/>
            <Meal uuid={'5031a2b4-522f-4ce3-8b3d-4385c6ed2ea9'}
                  course={'main'}
                  courseNumber={2}
                  description={null}
                  name={'Řízel'}
                  globalRating={null}
                  userRating={null}/>
            <Meal uuid={'5031a2b4-522f-4ce3-8b3d-4385c6ed2ea9'}
                  course={'main'}
                  courseNumber={3}
                  description={null}
                  name={'Řízel'}
                  globalRating={null}
                  userRating={null}/>
            <Meal uuid={'5031a2b4-522f-4ce3-8b3d-4385c6ed2ea9'}
                  course={'addition'}
                  courseNumber={null}
                  description={null}
                  name={'Yum'}
                  globalRating={null}
                  userRating={null}/>
        </Box>
    );
};

type Course = 'soup' | 'main' | 'addition';

interface MealProps {
    uuid: string,
    course: Course;
    courseNumber: number | null;
    name: string;
    description: string | null;
    userRating: number | null;
    globalRating: number | null;
}

interface MealRatingProps {
    icon: string;
    rating: number;
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
                {rating}
                <i className={'rating-star fa-solid fa-star'}/>
            </span>
        </StoluTooltip>
    );
};

const Meal: React.FC<MealProps> = ({
                                       uuid,
                                       course,
                                       courseNumber,
                                       name,
                                       description,
                                       userRating,
                                       globalRating
                                   }) => {
    const [t] = useTranslation();
    const type = courseNumber ?? t(course);
    const navigate = useNavigate();

    const handleOpen = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        if (!(event.target as HTMLElement).classList.contains('meal-opener')) return;
        navigate('/meal/' + uuid);
    };

    return (
        <Box className={'meal meal-opener'} onClick={handleOpen}>
            <Typography className={'type meal-opener'}
                        variant={'h6'}>
                {type}
            </Typography>
            <Typography className={'name meal-opener'}>
                {name}
            </Typography>
            <Box className={'rating-box meal-opener'}>
                {/*<Rating icon={<i className={'fa-solid fa-utensils'}/>}/>*/}
                <Rating/>
                <Box className={'ratings'}>
                    <MealRating rating={4.4} icon={'fa-solid fa-user'} tooltip={t('personalRating')}/>
                    <MealRating rating={3.4} icon={'fa-solid fa-users'} tooltip={t('globalRating')}/>
                </Box>
            </Box>
        </Box>
    );
};