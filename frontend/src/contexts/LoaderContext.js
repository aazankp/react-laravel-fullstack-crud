import { createContext, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { useDispatch } from 'react-redux';

export const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const loadingBarRef = useRef();

  const startLoading = () => {
    loadingBarRef.current?.continuousStart();
  };

  const finishLoading = () => {
    loadingBarRef.current?.complete();
  };

  return (
    <LoaderContext.Provider value={{ startLoading, finishLoading }}>
      <LoadingBar color="#e74c3c" height={2} ref={loadingBarRef} />
      {children}
    </LoaderContext.Provider>
  );
};