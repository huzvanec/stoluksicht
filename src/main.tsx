import ReactDOM from 'react-dom/client';
import './main.scss';
import {Page} from './component/Page.tsx';
import '@fontsource/changa';
import './i18n';
import React from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Page/>
);

export type Renderer = () => React.ReactNode;