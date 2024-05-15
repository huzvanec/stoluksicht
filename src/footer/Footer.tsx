import './footer.scss';
import {Box, Divider, Link, Typography} from '@mui/material';
import {Trans, useTranslation} from 'react-i18next';
import useStolu from '../provider/StoluProvider';
import {bleeding} from '../header/Header';
import React from 'react';

const headHash: string | undefined = process.env.REACT_APP_HEAD_HASH;
const buildTime: string | undefined = process.env.REACT_APP_BUILD_TIME;

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const footerPadding: number = 50; // px
export const Footer = () => {
    const [t] = useTranslation();
    const {mobile} = useStolu();
    return (
        <footer style={{
            paddingTop: `${footerPadding}px`,
            paddingBottom: mobile ? `${footerPadding + bleeding}px` : `${footerPadding}px`
        }}>
            <Box className={'cols'}
                 sx={{
                     flexDirection: mobile ? 'column' : undefined,
                     textAlign: mobile ? 'center' : undefined
                 }}>
                <Box>
                    <Typography>
                        Copyright &copy; 2024—{new Date().getFullYear()} <Link href={'https://jeme.cz'}>Jeme</Link>
                    </Typography>
                    <Typography>
                        <Trans i18nKey={'licence'} components={[
                            <Link target={'_blank'}
                                  href={'https://raw.githubusercontent.com/Mandlemankiller/stoluksicht/master/LICENCE'}>
                                WTFPL
                            </Link>
                        ]}/>
                    </Typography>
                </Box>
                <Box>
                    <Typography>
                        <Trans i18nKey={'openSource'} components={[
                            <Link target={'_blank'}
                                  href={'https://github.com/Mandlemankiller/stoluksicht'}>
                                open-source
                            </Link>
                        ]}/>
                    </Typography>
                    <Link target={'_blank'}
                          href={'https://github.com/Mandlemankiller/StolujemeAPI/issues/new?assignees=Mandlemankiller&labels=type%3A+bug&projects=&template=bug-report.yml'}>
                        {t('reportBug')}
                    </Link>
                    <Link target={'_blank'}
                          href={'https://github.com/Mandlemankiller/StolujemeAPI/issues/new?assignees=Mandlemankiller&labels=type%3A+feature&projects=&template=feature-request.yml'}>
                        {t('requestFeature')}
                    </Link>
                </Box>
            </Box>
            <Divider/>
            <Box className={'caption'}>
                <Typography variant={'subtitle2'}>
                    <Link
                        href={headHash
                            ? `https://github.com/Mandlemankiller/stoluksicht/tree/${headHash}`
                            : undefined}
                        target={'_blank'}>
                        stoluksicht/master@{headHash ?? 'development'}
                    </Link>
                    <br/>
                    {t('builtAt', {time: formatDate(buildTime ? new Date(buildTime) : new Date())})}
                </Typography>
                <Typography variant={'subtitle2'}>
                    <Trans i18nKey={'disclaimer'} components={[
                        <Link href={'https://strava.cz'}
                              target={'_blank'}>
                            STRAVA.CZ
                        </Link>,
                        <Link href={'https://visplzen.cz'}
                              target={'_blank'}>
                            VIS, PLZEŇ S.R.O.
                        </Link>
                    ]}/>
                </Typography>
            </Box>
        </footer>
    );
};