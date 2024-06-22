import './logIn.scss';
import {Box, Button, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import React, {useRef, useState} from 'react';
import {FieldValues, useForm} from 'react-hook-form';
import {EmailField, LinkField, PasswordField} from '../../component/form';
import {Navigate, NavigateFunction, useNavigate, useSearchParams} from 'react-router-dom';
import useStolu from '../../provider/StoluProvider';
import useApi, {AnyData, SuccessResponse} from '../../provider/ApiProvider';
import bear from '../../media/bear.mp4';

export const returnUrlQuery: string = 'return';

export const LogIn: React.FC = () => {
    const navigate: NavigateFunction = useNavigate();
    const {setLoading} = useStolu();
    const {apiCall, setToken, authenticated} = useApi();
    const [authenticatedInitial] = useState<boolean>(useRef(authenticated).current);
    const [searchParams] = useSearchParams();


    const returnPath: string = '/' + (searchParams.has(returnUrlQuery) ? searchParams.get(returnUrlQuery) : '');

    const logIn = async (data: FieldValues): Promise<boolean> => {
        setLoading(true);
        const response = await apiCall(api => api.post('/log-in', {
            // TODO
            // email: data.email + data.emailSuffix,
            email: data.email + '@email.cz',
            password: data.password
        }));
        setLoading(false);
        if (response.state !== 'success') return false;
        const content: AnyData = (response.response as SuccessResponse).content;
        setToken(content.session.token);
        navigate(returnPath);
        return true;
    };

    const {
        register,
        handleSubmit,
        formState: {errors},
        clearErrors,
    } = useForm({
        mode: 'all'
    });

    const [t, i18n] = useTranslation();
    i18n.on('languageChanged', () => clearErrors());
    if (authenticatedInitial) {
        return (<Navigate to={'/'}/>);
    } else {
        return (
            <Box className={'log-in-form form menu'}
                 component={'form'}
                 onSubmit={handleSubmit(logIn)}>
                <Typography variant={'h4'} className={'title'}>
                    {t('logIn')}
                </Typography>
                <EmailField errors={errors} register={register}/>
                <PasswordField errors={errors} register={register}/>
                <Button type={'submit'}
                        fullWidth
                        variant={'contained'}>
                    {t('logIn')}
                </Button>
                <LinkField to={'/register'}
                           text={t('dontHaveAccount')}/>
                <LinkField target={'_blank'}
                           to={bear}
                           text={t('forgottenPassword')}/>
            </Box>
        );
    }
};