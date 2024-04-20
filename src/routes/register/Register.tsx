import './register.scss';
import {Box, Button, Link, MenuItem, Select, TextField, TextFieldProps, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {NavLink} from 'react-router-dom';
import React, {useState} from 'react';
import {FieldValues, useForm} from 'react-hook-form';
import {RegisterOptions} from 'react-hook-form/dist/types/validator';
import {FieldErrors} from 'react-hook-form/dist/types/errors';
import {UseFormRegister} from 'react-hook-form/dist/types/form';
import {validate as validateEmail} from 'email-validator';
import api, {ErrorResponse} from '../../apiUtils';
import axios from 'axios';
import {usePage} from '../../Page';

export const Register = () => {
    const [t, i18n] = useTranslation();
    const [emailSuffix, setEmailSuffix] = useState<string>('@ceskolipska.cz');
    const {setLoading, apiSnack} = usePage();

    const {
        register,
        handleSubmit,
        formState: {errors},
        clearErrors,
    } = useForm({
        mode: 'all'
    });

    const submit = (data: FieldValues): void => {
        console.log(data);
        setLoading(true);
        api((base) => axios.post(`${base}/register`, {
            name: data.username,
            email: data.email + emailSuffix,
            password: data.password
        }), apiSnack).then((res) => {
            setLoading(false);
            if (!res || !res.success) return;

        });
    };

    // TODO
    i18n.on('languageChanged', () => clearErrors());

    return (
        <>
            <Box className={'sign-up menu'} component={'form'} onSubmit={handleSubmit(submit)}>
                <Typography variant={'h3'} className={'title'}>
                    {t('register')}
                </Typography>
                <ValidatedTextField
                    minLength={3}
                    maxLength={30}
                    pattern={/^[a-zA-Z0-9 ._-]*$/}
                    field={'username'}
                    errors={errors}
                    register={register}
                    label={t('username')}
                    autoComplete={'username'}
                    autoFocus
                    required
                    fullWidth
                />
                <Box className={'email-wrapper'}>
                    <ValidatedTextField
                        options={{
                            validate: email => validateEmail(email + emailSuffix) || t('emailInvalid')
                        }}
                        field={'email'}
                        errors={errors}
                        register={register}
                        label={t('emailAddress')}
                        autoComplete={'email'}
                        required
                        fullWidth
                    />
                    <Select value={emailSuffix}
                            className={'email-suffix'}
                            onChange={(event) => setEmailSuffix(event.target.value)}>
                        <MenuItem value={'@ceskolipska.cz'}>@ceskolipska.cz</MenuItem>
                    </Select>
                </Box>
                <ValidatedTextField
                    field={'password'}
                    minLength={5}
                    maxLength={100}
                    errors={errors}
                    register={register}
                    label={t('password')}
                    autoComplete={'new-password'}
                    type={'password'}
                    required
                    fullWidth
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                >
                    {t('register')}
                </Button>
                <Link variant="body2"
                      component={NavLink}
                      to={'/log-in'}>
                    {t('alreadyHaveAccount')}
                </Link>
            </Box>
        </>
    );
};

export type ValidatedTextFieldProps = TextFieldProps & {
    field: string;
    options?: RegisterOptions;
    errors: FieldErrors;
    register: UseFormRegister<any>;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
}

export const ValidatedTextField: React.FC<ValidatedTextFieldProps> = ({
                                                                          field,
                                                                          options = {},
                                                                          errors,
                                                                          register,
                                                                          id,
                                                                          required,
                                                                          minLength,
                                                                          maxLength,
                                                                          pattern,
                                                                          ...other
                                                                      }) => {
    const [tr] = useTranslation();
    if (minLength) options.minLength = {
        value: minLength,
        message: tr('short', {what: tr(field), length: minLength})
    };
    if (maxLength) options.maxLength = {
        value: maxLength,
        message: tr('long', {what: tr(field), length: maxLength})
    };
    if (required) options.required = tr('fieldRequired');
    if (pattern) options.pattern = {
        value: pattern,
        message: tr(field + 'Invalid')
    };
    return (
        <TextField
            id={field}
            error={!!errors[field]}
            helperText={(errors[field] && errors[field]?.message?.toString()) ?? ' '}
            required={required}
            {...register(field, options)}
            {...other}
        />
    );
};