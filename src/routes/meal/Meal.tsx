import React, {ReactNode, useEffect, useState} from 'react';
import {Navigate, NavLink, useParams} from 'react-router-dom';
import {Box, Button, Rating, Skeleton, Typography, useColorScheme} from '@mui/material';
import useApi, {AnyData, ErrorResponse, SuccessResponse} from '../../provider/ApiProvider';
import './meal.scss';
import {useTranslation} from 'react-i18next';
import {StoluIconButton, StoluTooltip} from '../../header/Header';
import {Helmet} from 'react-helmet';
import NotFound from '../404/NotFound';
import {Renderer} from '../../main.tsx';
import {grey} from '@mui/material/colors';
import useStolu from '../../provider/StoluProvider.tsx';
import Carousel from 'react-material-ui-carousel';

export type Course = 'soup' | 'main' | 'addition';

export interface MealData {
    course: Course,
    description: string | null,
    name: string,
    userRating: number,
    globalRating: number
}

interface MealProfileData extends MealData {
    canteen: string,
    photoUuids: string[]
}

const Meal = () => {
    const {apiCall, api} = useApi();
    const {mobile} = useStolu();
    const {uuid} = useParams<{ uuid: string }>();
    const [notFound, setNotFound] = useState<boolean>(false);
    const [mealData, setMealData] = useState<MealProfileData | undefined>();
    const [mealPhotoUrls, setMealPhotoUrls] = useState<string[] | undefined>();
    const [t] = useTranslation();
    const {colorScheme} = useColorScheme();

    const getMeal = async () => {
        const response = await apiCall(api => api.get('/meals/' + uuid));
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
            name: data.meal.names[0],
            photoUuids: data.meal.photos,
            userRating: data.meal.ratings.user,
            globalRating: data.meal.ratings.global
        });
    };

    const getPhotos = async () => {
        if (!mealData) return;
        try {
            const urlsTemp: string[] = [];
            for (const photoUuid of mealData.photoUuids) {
                const response = await api.get(`/meals/${uuid}/photos/${photoUuid}/view`, {
                    responseType: 'blob',
                });
                const url = URL.createObjectURL(response.data);
                urlsTemp.push(url);
            }
            setMealPhotoUrls(urlsTemp);
        } catch (e_) {
            console.debug(e_);
        }
    };

    useEffect(() => {
        getMeal();

        return () => {
            mealPhotoUrls?.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    useEffect(() => {
        getPhotos();
    }, [mealData]);

    const mealDescription: Renderer = () => {
        if (!mealData) return <Typography typography={'body1'}><Skeleton/></Typography>;
        if (!mealData.description)
            return (
                <Typography typography={'body1'} sx={{
                    fontStyle: 'italic',
                    color: grey[colorScheme == 'light' ? 700 : 400]
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

    const carousel: Renderer = () => {
        if (mealPhotoUrls?.length == 0)
            return <Typography typography={'body1'} sx={{
                fontStyle: 'italic',
                color: grey[colorScheme == 'light' ? 700 : 400]
            }}>
                {t('noPhotos')}
            </Typography>;
        const content: ReactNode = !mealData || !mealPhotoUrls ?
            <Skeleton height={300} style={{width: '100%'}}/> :
            mealPhotoUrls.map((url, index) => <img key={index} src={url} alt=""/>);
        return (
            <Carousel className={'carousel'}
                      navButtonsAlwaysVisible
                      autoPlay={false}>
                {content}
            </Carousel>
        );
    };

    if (notFound) {
        return (<NotFound/>);
    } else {
        return (
            <>
                <Helmet title={mealData ? mealData.name : 'Loading...'}/>
                <Box className={'meal-profile menu'}>
                    <Box className={'top'}>
                        <Button className={'back'}
                                component={NavLink}
                                to={'/menu'}
                                variant={'outlined'}>
                            <i className={'fa-solid fa-backward'}/>
                            {t('backToMenu')}
                        </Button>
                        <Box className={'toolbar'}>
                            <MealShortLink uuid={uuid!}/>
                        </Box>
                    </Box>
                    <Box className={'bottom'}>
                        <Box className={'info'} style={{
                            maxWidth: mobile ? '100%' : '50%'
                        }}>
                            <Typography typography={'h6'}>
                                {mealData ? t(mealData.course.toLowerCase()) : <Skeleton/>}
                            </Typography>
                            <Typography typography={'h4'} className={'name'}>
                                {mealData ? mealData.name : <Skeleton/>}
                            </Typography>
                            <Typography typography={'overline'}>{t('description')}</Typography>
                            {mealDescription()}
                            <Typography typography={'overline'}>{t('rating')}</Typography>
                            {
                                (mealData) ?
                                    <Box className={'ratings'}>
                                        {t('personalRating') + ':'}
                                        <Rating readOnly value={mealData.userRating} precision={.1}/>
                                        <p>({mealData.userRating ? mealData.userRating.toFixed(1) : '—'})</p>
                                        {t('globalRating') + ':'}
                                        <Rating readOnly value={mealData.globalRating} precision={.1}/>
                                        <p>({mealData.globalRating ? mealData.globalRating.toFixed(1) : '—'})</p>
                                    </Box> :
                                    null
                            }
                        </Box>
                        <Box className={'photos'} style={{
                            width: mobile ? '100%' : '40%'
                        }}>
                            <Typography typography={'overline'}>{t('photos')}</Typography>
                            {carousel()}
                        </Box>
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


export interface MealShortLinkProps {
    uuid: string;
}

export const MealShortLink: React.FC<MealShortLinkProps> = ({uuid}) => {
    const [t] = useTranslation();
    const {snack} = useStolu();

    const copyShortLink = () => {
        const shortUuid: string = uuid!.replace(/-/g, '');
        const shortLink: string = `${window.location.host}/m/${shortUuid}`;
        navigator.clipboard.writeText(shortLink);
        snack(t('linkCopied'), 'success');
    };

    return (
        <StoluTooltip title={t('copyMealLink')}>
            <StoluIconButton icon={'fa-solid fa-link'}
                             className={'action'}
                             onClick={copyShortLink}/>
        </StoluTooltip>
    );
};