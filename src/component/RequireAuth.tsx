import {Navigate} from 'react-router-dom';
import useApi from '../provider/ApiProvider';
import React, {PropsWithChildren, ReactNode, useEffect, useState} from 'react';
import {returnUrlQuery} from '../routes/log-in/LogIn';

const RequireAuth: React.FC<PropsWithChildren> = ({children}) => {
    const {authenticated} = useApi();
    const [navigator, setNavigator] = useState<ReactNode>();

    useEffect(() => {
        const loc: string = window.location.pathname.substring(1) + window.location.search;
        setNavigator(<Navigate to={`/log-in?${returnUrlQuery}=${encodeURIComponent(loc)}`}/>);
    }, []);

    return authenticated ? children : navigator;
};
export default RequireAuth;