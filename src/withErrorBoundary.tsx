import React, { FC, useEffect, useState } from "react";
import { useMountedState } from "react-use";
import { ErrorPage } from "./components/ErrorPage";
import { ErrorBoundary } from "react-error-boundary";

/**
 * An HOC that sets up a global listener on uncaught errors thrown by asynchronous code,
 * and rethrows them within the React lifecycle so that they can be handled by an <ErrorBoundary />.
 */
const withAsyncErrorHandling = (WrappedComponent: FC): FC => () => {
  const [, setState] = useState();
  const isMounted = useMountedState();

  useEffect(() => {
    const handleAsyncError = (event: PromiseRejectionEvent) => {
      // Implementation idea taken from https://github.com/facebook/react/issues/14981#issuecomment-468460187
      setState(() => {
        throw new Error(event.reason);
      });
    };
    window.addEventListener("unhandledrejection", handleAsyncError);
    return () => {
      window.removeEventListener("unhandledrejection", handleAsyncError);
    };
  }, []);

  if (!isMounted) {
    // Wait for the listener to be in place before rendering anything.
    return null;
  }

  return <WrappedComponent />;
};

/**
 * Catches the exceptions of the Component.
 */
export const withErrorBoundary = (Component: FC): FC => () => {
  const WrappedComponent = withAsyncErrorHandling(Component);
  return (
    <ErrorBoundary
      FallbackComponent={ErrorPage}
      onError={(error, info) => {
        console.error(error, info);
      }}
    >
      <WrappedComponent />
    </ErrorBoundary>
  );
};
