import { LoaderContext } from '../../contexts/LoaderContext';
import { useContext, useEffect } from 'react';

const Dashboard = () => {
  const { startLoading, finishLoading } = useContext(LoaderContext);

  useEffect(() => {
    startLoading();
    finishLoading();
  }, []);

  return (
    <div className="home-page">
      <h1>Welcome to the Home Page</h1>
      <p>This is a sample home page in your app.</p>
    </div>
  );
};

export default Dashboard;