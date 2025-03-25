import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import ContextStoreProvider from 'stores/ContextStore';
import App from './App';
const APP_GB = `${process.env.REACT_APP_GB}`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div>
    {/* // description : 개발 BrowserRouter 운영 HashRouter 모든 url 시작에 # 자동으로 붙인다. */}
    {APP_GB === 'DEV' ? (
      <BrowserRouter>
        <ContextStoreProvider>
          <App />
        </ContextStoreProvider>
      </BrowserRouter>
    ) : (
      <HashRouter>
        <ContextStoreProvider>
          <App />
        </ContextStoreProvider>
      </HashRouter>
    )}
  </div>
);
