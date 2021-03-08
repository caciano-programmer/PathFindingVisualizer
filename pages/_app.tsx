import React from 'react';
import ErrorBoundary from '../components/errorBoundary';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <React.StrictMode>
        <Component {...pageProps} />
      </React.StrictMode>
    </ErrorBoundary>
  );
}

export default MyApp;
