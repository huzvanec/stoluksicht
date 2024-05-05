import {Link, LinkProps, MenuItem, Select, TextField, TextFieldProps} from '@mui/material';
import {RegisterOptions} from 'react-hook-form/dist/types/validator';
import {FieldErrors} from 'react-hook-form/dist/types/errors';
import {UseFormRegister} from 'react-hook-form/dist/types/form';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {validate as validateEmail} from 'email-validator';
import {NavLink} from 'react-router-dom';

export type ValidatedTextFieldProps = TextFieldProps & {
    field: string;
    options?: RegisterOptions;
    errors: FieldErrors;
    register: UseFormRegister<any>;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
}


export type TextFieldChildProps = TextFieldProps & {
    errors: FieldErrors;
    register: UseFormRegister<any>;
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

export const NameField: React.FC<TextFieldChildProps> = ({...other}) => {
    const [t] = useTranslation();
    return (
        <ValidatedTextField minLength={3}
                            maxLength={30}
                            pattern={/^[a-zA-Z0-9 ._-]*$/}
                            field={'username'}
                            label={t('username')}
                            autoComplete={'username'}
                            required
                            fullWidth
                            {...other}/>
    );
};

export const emailSuffixes: string[] = [
    '@ceskolipska.cz'
];

export const EmailField: React.FC<TextFieldChildProps> = ({register, ...other}) => {
    const [t] = useTranslation();
    const [emailSuffix, setEmailSuffix] = useState<string>('@ceskolipska.cz');

    return (
        <>
            <ValidatedTextField className={'email'}
                                options={{
                                    validate: email => validateEmail(email + emailSuffix) || t('emailInvalid')
                                }}
                                field={'email'}
                                FormHelperTextProps={{className: 'email-helper'}}
                                label={t('emailAddress')}
                                autoComplete={'email'}
                                required
                                fullWidth
                                register={register}
                                {...other}/>
            <Select value={emailSuffix}
                    className={'email-suffix'}
                    fullWidth
                    {...register('emailSuffix')}
                    onChange={(event) => setEmailSuffix(event.target.value)}>
                {emailSuffixes.map(suffix => <MenuItem key={suffix} value={suffix}>{suffix}</MenuItem>)}
            </Select>
        </>
    );
};

export const PasswordField: React.FC<TextFieldChildProps> = ({...other}) => {
    const [t] = useTranslation();

    return (
        <ValidatedTextField
            field={'password'}
            minLength={5}
            maxLength={100}
            label={t('password')}
            autoComplete={'new-password'}
            type={'password'}
            required
            fullWidth
            {...other}/>
    );
};

export type LinkFieldProps = LinkProps & {
    to: string;
    text: string;
}

export const LinkField: React.FC<LinkFieldProps> = ({to, text, ...other}) => {
    return (
        <Link component={NavLink}
              to={to}
              variant="body2"
              {...other}>
            {text}
        </Link>
    );
};