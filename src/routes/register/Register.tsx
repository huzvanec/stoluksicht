import './register.scss';
import {Box, Button, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import React, {useEffect, useState} from 'react';
import {FieldValues, useForm} from 'react-hook-form';
import {a} from '../../AnimatedRouter';
import {currentLanguage} from '../../i18n';
import {EmailField, LinkField, NameField, PasswordField} from '../../form';
import useStolu from '../../provider/StoluProvider';
import useApi from '../../provider/ApiProvider';

const verificationTime: number = 15 * 60; // seconds

export const Register = () => {
    const {setLoading} = useStolu();
    const {apiCall} = useApi();
    const [formData, setFormData] = useState<FieldValues>();

    const verifySend = async (data: FieldValues = formData as FieldValues): Promise<boolean> => {
        setLoading(true);
        const response = await apiCall(api => api.post('/register', {
            name: data.username,
            // TODO
            // email: data.email + data.emailSuffix,
            email: data.email + '@email.cz',
            password: data.password,
            language: currentLanguage()
        }));
        setLoading(false);
        return (!!response && response.success);
    };

    const submit = async (data: FieldValues): Promise<boolean> => {
        const result = await verifySend(data);
        if (result) setFormData(data);
        return result;
    };


    return a(
        <>
            {(formData)
                ? <VerifySendForm data={formData} verifySend={verifySend}/>
                : <RegisterForm submit={submit}/>}
        </>,
        formData
    );
};

interface VerifySendFormProps {
    data: FieldValues;
    verifySend: () => Promise<boolean>;
}

const VerifySendForm: React.FC<VerifySendFormProps> = ({data, verifySend}) => {
    const [t] = useTranslation();
    const [time, setTime] = useState<number>(verificationTime);
    const [startTime, setStartTime] = useState<number>(Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            if (time <= 0) {
                clearInterval(timer);
            } else {
                setTime(verificationTime - Math.round((Date.now() - startTime) / 1000));
            }
        }, 1000);

        const preventExit = (event: BeforeUnloadEvent) => event.preventDefault();

        window.addEventListener('beforeunload', preventExit);

        return () => {
            clearInterval(timer);
            window.removeEventListener('beforeunload', preventExit);
        };
    }, [time]);


    const minutes: number = Math.floor(time / 60);
    const seconds: number = time % 60;

    const padTime = (num: number) => num.toString().padStart(2, '0');

    const resend = async () => {
        const result = await verifySend();
        if (result) {
            setStartTime(Date.now());
            setTime(verificationTime);
        }
    };

    return (
        <Box className={'verify-send-form form menu'}>
            <Typography variant={'h4'} className={'title'}>
                {t('verifySend')}
            </Typography>
            <Typography>
                {t('verifyInfo', {email: data.email + data.emailSuffix})}
            </Typography>
            {(time <= 0)
                ? <Typography className={'verify-expired'}>
                    {t('verifyExpired')}
                </Typography>
                : <Typography>
                    {t('verifyExpire', {
                        minutes: padTime(minutes),
                        seconds: padTime(seconds)
                    })}
                </Typography>
            }
            <Button variant={'contained'}
                    fullWidth
                    className={'verify-resend'}
                    onClick={resend}>
                {t('verifyResend')}
            </Button>
        </Box>
    );
};


interface RegisterFormProps {
    submit: (data: FieldValues) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({submit}) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        clearErrors,
    } = useForm({
        mode: 'all'
    });

    const [t, i18n] = useTranslation();
    // TODO
    i18n.on('languageChanged', () => clearErrors());

    return (
        <Box className={'register-form form menu'} component={'form'} onSubmit={handleSubmit(submit)}>
            <Typography variant={'h4'} className={'title'}>
                {t('register')}
            </Typography>
            <NameField register={register} errors={errors}/>
            <EmailField errors={errors} register={register}/>
            <PasswordField errors={errors} register={register}/>
            <Button type={'submit'}
                    fullWidth
                    variant={'contained'}>
                {t('register')}
            </Button>
            <LinkField to={'/log-in'}
                       text={t('alreadyHaveAccount')}/>
        </Box>
    );
};