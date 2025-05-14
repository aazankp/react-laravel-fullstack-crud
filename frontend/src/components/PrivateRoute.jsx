import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api, basePath } from '../services/api';

const PrivateRoute = () => {
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await api.get(basePath + '/checkLogin', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // console.log('API response:', response.data);

        if (response.data.status === 'not_logged_in') {
          setIsAuthorized(false);
          localStorage.removeItem('token');
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        setIsAuthorized(false);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [location.pathname]);

  if (loading) return null;

  return isAuthorized ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;