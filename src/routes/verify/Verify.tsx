import {NavLink, useParams} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {Box, Button, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import './verify.scss';
import useStolu from '../../provider/StoluProvider';
import useApi, {ApiState} from '../../provider/ApiProvider';

export const Verify: React.FC = () => {
    const [t] = useTranslation();
    const {code} = useParams<{ code: string }>();
    const {setLoading} = useStolu();
    const {apiCall} = useApi();
    const [apiState, setApiState] = useState<ApiState>('processing');

    const verify = async (code: string) => {
        setLoading(true);
        const response = await apiCall(api => api.post('/verify',
            {
                code: code
            }));
        setApiState(response.state);
        setLoading(false);
    };

    useEffect(() => {
        if (code) {
            verify(code);
        } else {
            setApiState('error');
        }
    }, []);

    let tTitle: string;
    let tInfo: string;
    switch (apiState) {
        case 'success':
            tTitle = 'verifySuccess';
            tInfo = 'verifySuccessInfo';
            break;
        case 'processing':
            tTitle = 'verifyProgress';
            tInfo = 'verifyProgressInfo';
            break;
        case 'error':
            tTitle = 'verifyError';
            tInfo = 'verifyErrorInfo';
            break;
    }

    const renderButton = (): React.JSX.Element | null => {
        switch (apiState) {
            case 'success':
                return (
                    <Button component={NavLink}
                            to={'/log-in'}
                            fullWidth
                            variant={'contained'}>
                        {t('logIn')}
                    </Button>
                );
            case 'error':
                return (
                    <Button component={NavLink}
                            to={'/register'}
                            fullWidth
                            variant={'contained'}>
                        {t('register')}
                    </Button>
                );
            default:
                return null;
        }
    };

    return (
        <Box className={'form menu verify-form'}>
            <Typography variant={'h4'} className={'title'}>
                {t(tTitle)}
            </Typography>
            <Typography>
                {t(tInfo)}
            </Typography>
            {renderButton()}
        </Box>
    );
};