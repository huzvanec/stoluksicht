import React, {useEffect, useState} from 'react';
import {Navigate, useParams} from 'react-router-dom';
import {Box, Rating, Skeleton, Typography} from '@mui/material';
import useApi, {AnyData, SuccessResponse} from '../../provider/ApiProvider';
import './meal.scss';
import {useTranslation} from 'react-i18next';
import {StoluIconButton, StoluTooltip} from '../../header/Header';
import {Helmet} from 'react-helmet';

interface MealData {
    uuid: string,
    canteen: string,
    course: string,
    description: string | null,
    mealNames: string[],
    photoUuids: string[]
}


const Meal = () => {
    const {apiCall} = useApi();

    const {uuid: mealUuid} = useParams<{ uuid: string }>();

    const [name, setName] = useState<undefined | string>();
    const [mealData, setMealData] = useState<MealData | undefined>();
    const [t] = useTranslation();


    const loadMeal = async () => {
        const response = await apiCall(api => api.get('/meal/' + mealUuid));
        if (response.state !== 'success') return;
        const data: AnyData = (response.response as SuccessResponse).content;
        setMealData({
            uuid: data.meal.uuid,
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

    return (
        <>
            <Helmet title={mealData ? mealData.mealNames[0] : 'Loading...'}/>
            <Box className={'meal-profile menu'}>
                <Box className={'top'}>
                    <Typography typography={'h6'}>
                        {!!mealData ? 'Soup' : <Skeleton/>}
                    </Typography>
                    <Box className={'toolbar'}>
                        <StoluTooltip title={'uwiu'}>
                            <StoluIconButton icon={'fa-solid fa-link'} className={'action'}/>
                        </StoluTooltip>
                    </Box>
                </Box>
                <Typography typography={'h4'} className={'name'}>
                    {!!mealData ? 'Pštrosí vejce, brambory (mleté maso plněné vařeným vajíčkem)' : <Skeleton/>}
                </Typography>
                <Typography typography={'overline'}>{t('description')}</Typography>
                <Typography typography={'body1'}>
                    {!!mealData ? 'Velký kynutý knedlík plněný švestkovými povidly, politý vanilkovou omáčkou a sypaný mákem.' :
                        <Skeleton/>}
                </Typography>
                <Typography typography={'overline'}>{t('rating')}</Typography>
                <Box>
                    <Rating readOnly value={2}/>
                </Box>
            </Box>
        </>
    );
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