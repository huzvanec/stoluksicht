import ReactDOM from 'react-dom/client';
import './index.scss';
import {Page} from './Page';
import '@fontsource/changa';
import './i18n'; // language support

const root: ReactDOM.Root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(<Page/>);