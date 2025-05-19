import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api, basePath } from '../services/api';

const PrivateRoute = () => {
  const location = useLocation();

  const [authState, setAuthState] = useState({
    isAuthorized: false,
    loading: true,
  });
  
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await api.get(basePath + '/checkLogin', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (response.data.status === 'not_logged_in') {
          localStorage.removeItem('token');
          setAuthState({ isAuthorized: false, loading: false });
        } else {
          setAuthState({ isAuthorized: true, loading: false });
        }
      } catch (error) {
        localStorage.removeItem('token');
        setAuthState({ isAuthorized: false, loading: false });
      }
    };
  
    verifyToken();
  }, [location.pathname]);
  
  if (authState.loading) return null;
  
  return authState.isAuthorized ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;