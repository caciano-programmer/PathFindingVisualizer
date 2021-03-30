import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import '../styles/globals.css';

export default function MyApp({ Component }: AppProps) {
  return (
    <>
      <HtmlHead />
      <React.StrictMode>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Component />
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
