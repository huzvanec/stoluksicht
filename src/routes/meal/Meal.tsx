import React, {useEffect, useState} from 'react';
import {Navigate, useParams} from 'react-router-dom';
import {Box, Rating, Skeleton, Typography} from '@mui/material';
import useApi, {AnyData, ErrorResponse, SuccessResponse} from '../../provider/ApiProvider';
import './meal.scss';
import {useTranslation} from 'react-i18next';
import {StoluIconButton, StoluTooltip} from '../../header/Header';
import {Helmet} from 'react-helmet';
import NotFound from '../404/NotFound';
import {Renderer} from '../../index';
import {grey} from '@mui/material/colors';

type Description = string | null;

interface MealData {
    canteen: string,
    course: string,
    description: Description,
    mealNames: string[],
    photoUuids: string[]
}


const Meal = () => {
    const {apiCall} = useApi();

    const {uuid: mealUuid} = useParams<{ uuid: string }>();

    const [notFound, setNotFound] = useState<boolean>(false);
    const [mealData, setMealData] = useState<MealData | undefined>();
    const [t] = useTranslation();


    const loadMeal = async () => {
        const response = await apiCall(api => api.get('/meal/' + mealUuid));
        if (response.state === 'error') {
            const errorType: string = (response.response as ErrorResponse).error.type;
            if (errorType === 'MEAL_UUID_INVALID') setNotFound(true);
            return;
        } else if (response.state !== 'success') return;
        const data: AnyData = (response.response as SuccessResponse).content;
        setMealData({
            canteen: data.meal.canteen,
            course: data.meal.course,
            description: data.meal.description,
            mealNames: data.names,
            photoUuids: data.photos
        });
    };

    useEffect(() => {
        loadMeal();
    }, []);

    const mealDescription: Renderer = () => {
        if (!mealData) return <Typography typography={'body1'}><Skeleton/></Typography>;
        if (!mealData.description)
            return (
                <Typography typography={'body1'} sx={{
                    fontStyle: 'italic',
                    color: grey[400]
                }}>
                    {t('noDescription')}
                </Typography>
            );
        return (
            <Typography typography={'body1'}>
                {mealData.description}
            </Typography>
        );
    };

    if (notFound) {
        return (<NotFound/>);
    } else {
        return (
            <>
                <Helmet title={mealData ? mealData.mealNames[0] : 'Loading...'}/>
                <Box className={'meal-profile menu'}>
                    <Box className={'top'}>
                        <Typography typography={'h6'}>
                            {!!mealData ? t(mealData.course.toLowerCase()) : <Skeleton/>}
                        </Typography>
                        <Box className={'toolbar'}>
                            <StoluTooltip title={'uwiu'}>
                                <StoluIconButton icon={'fa-solid fa-link'} className={'action'}/>
                            </StoluTooltip>
                        </Box>
                    </Box>
                    <Typography typography={'h4'} className={'name'}>
                        {!!mealData ? mealData.mealNames[0] : <Skeleton/>}
                    </Typography>
                    <Typography typography={'overline'}>{t('description')}</Typography>
                    {mealDescription()}
                    <Typography typography={'overline'}>{t('rating')}</Typography>
                    <Box>
                        <Rating readOnly value={2}/>
                    </Box>
                </Box>
            </>
        );
    }
};
export default Meal;

export const M: React.FC = () => {
    const {uuid} = useParams<{ uuid: string }>();
    const dashUuid = (uuid: string | undefined): string | undefined => {
        if (!uuid) return undefined;
        if (uuid.length !== 32) return uuid;
        const dashed: string = `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
        return dashed.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
            ? dashed
            : uuid;
    };
    return (
        <Navigate to={'/meal/' + dashUuid(uuid)}/>
    );
};