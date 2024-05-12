import './footer.scss';
import {Link, Typography} from '@mui/material';
import {Trans, useTranslation} from 'react-i18next';
import useStolu from '../provider/StoluProvider';
import {bleeding} from '../header/Header';

export const footerPadding: number = 30; // px
export const Footer = () => {
    const [t] = useTranslation();
    const {mobile} = useStolu();
    return (
        <footer style={{
            padding: footerPadding,
            paddingBottom: mobile ? `${bleeding + footerPadding}px` : footerPadding
        }}>
            <Typography>
                Copyright &copy; 2024—{new Date().getFullYear()} <Link href={'https://jeme.cz'}>Jeme</Link>
            </Typography>
            <Typography>
                <Trans i18nKey={'licence'} components={[
                    <Link href={'https://raw.githubusercontent.com/Mandlemankiller/stoluksicht/master/LICENCE'}>
                        WTFPL
                    </Link>
                ]}/>
            </Typography>
            <Typography>
                <Trans i18nKey={'disclaimer'} components={[
                    <Link href={'https://strava.cz'}>
                        STRAVA.CZ
                    </Link>,
                    <Link href={'https://visplzen.cz'}>
                        VIS, PLZEŇ S.R.O.
                    </Link>
                ]}/>
            </Typography>
        </footer>
    );
};