import './logIn.scss';
import {Box, Button, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import React from 'react';
import {FieldValues, useForm} from 'react-hook-form';
import {EmailField, LinkField, PasswordField} from '../../form';
import {NavigateFunction, useNavigate} from 'react-router-dom';
import useStolu from '../../provider/StoluProvider';
import useApi, {AnyData, SuccessResponse} from '../../provider/ApiProvider';

export const LogIn = () => {
    const navigate: NavigateFunction = useNavigate();
    const {setLoading} = useStolu();
    const {apiCall, setToken} = useApi();

    const logIn = async (data: FieldValues): Promise<boolean> => {
        setLoading(true);
        const response = await apiCall(api => api.post('/log-in', {
            // TODO
            // email: data.email + data.emailSuffix,
            email: data.email + '@email.cz',
            password: data.password
        }));
        setLoading(false);
        if (!response || !response.success) return false;
        const content: AnyData = (response as SuccessResponse).content;
        setToken(content.session.token);
        navigate('/');
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
                       to={'https://youtu.be/_snjLiqvSOg'}
                       text={t('forgottenPassword')}/>
        </Box>
    );
};