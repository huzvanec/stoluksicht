import {Navigate} from 'react-router-dom';
import useApi from '../provider/ApiProvider';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import {returnUrlQuery} from '../routes/log-in/LogIn';

const RequireAuth: React.FC<PropsWithChildren> = ({children}) => {
    const {authenticated} = useApi();
    const [path, setPath] = useState<string>('');

    useEffect(() => {
        const loc: string = window.location.pathname.substring(1) + window.location.search;
        setPath(`/log-in?${returnUrlQuery}=${encodeURIComponent(loc)}`);
    }, []);

    return authenticated ? <>{children}</> : <Navigate to={path}/>;
};
export default RequireAuth;