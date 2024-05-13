import './footer.scss';
import {Box, Divider, Link, Typography} from '@mui/material';
import {Trans, useTranslation} from 'react-i18next';
import useStolu from '../provider/StoluProvider';
import {bleeding} from '../header/Header';
import React from 'react';

const headHash: string | undefined = process.env.REACT_APP_HEAD_HASH;

export const footerPadding: number = 50; // px
export const Footer = () => {
    const [t] = useTranslation();
    const {mobile} = useStolu();
    const repo: string = 'https://github.com/Mandlemankiller/stoluksicht';
    return (
        <footer style={{
            padding: footerPadding,
            paddingBottom: mobile ? `${bleeding + footerPadding}px` : footerPadding
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
                                  href={repo}>
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
                            : repo}
                        target={'_blank'}>
                        Mandlemankiller/stoluksicht/master@{headHash ?? 'unknown'}
                    </Link>
                </Typography>
                <Typography variant={'subtitle2'}>
                    <Trans i18nKey={'disclaimer'} components={[
                        <Link href={'https://strava.cz'}>
                            STRAVA.CZ
                        </Link>,
                        <Link href={'https://visplzen.cz'}>
                            VIS, PLZEŇ S.R.O.
                        </Link>
                    ]}/>
                </Typography>
            </Box>
        </footer>
    );
};