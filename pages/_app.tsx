import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

import '../styles/globals.css';

export default function MyApp({ Component }: AppProps) {
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
      <meta name="description" content="App to visualize path finding algorithms." />
      <link rel="icon" href="/favicon-16x16.png" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Lobster+Two:ital@0;1&display=swap" rel="stylesheet" />
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
