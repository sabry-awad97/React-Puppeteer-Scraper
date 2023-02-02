import './App.scss';

import React, { Suspense } from 'react';
import { Provider } from 'react-redux';

import createStore from './state/store';

const Scraper = React.lazy(() => import('./components/Scraper.js'));

function App() {
  return (
    <Provider store={createStore()}>
      <Suspense fallback={<div>Loading...</div>}>
        <Scraper />
      </Suspense>
    </Provider>
  );
}

export default App;
