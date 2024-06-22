import React from 'react';
import {Box, CircularProgress} from '@mui/material';

const Loading: React.FC = () => {
    return (
        <Box className={'loading'}>
            <CircularProgress/>
        </Box>
    );
};
export default Loading;