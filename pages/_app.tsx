import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

import '../styles/globals.css';

export default function MyApp({ Component }: AppProps) {
  useEffect(() => {
    const production = process.env.NODE_ENV === 'production';
    if ('serviceWorker' in navigator && production) navigator.serviceWorker.register('/sw.js');
  }, []);

  return (
    <>
      <HtmlHead />
      <React.StrictMode>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <DndProvider backend={TouchBackend}>
            <Provider store={store}>
              <Component />
            </Provider>
          </DndProvider>
        </ErrorBoundary>
      </React.StrictMode>
    </>
  );
}

function HtmlHead() {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Graph Visualizer</title>
      <meta name="theme-color" content="#083a8c" />
      <link rel="manifest" href="manifest.json" />
      <meta name="description" content="App to visualize path finding algorithms." />
      <link rel="icon" href="/icons/favicon-16x16.png" />
      <link rel="apple-touch-icon" href="/icons/apple-touch-icon-180x180.png" />
    </Head>
  );
}

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
