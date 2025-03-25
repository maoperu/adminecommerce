import { Navigate } from 'react-router-dom';
import { checkAuth } from '../utils/auth';

const PrivateRoute = ({ children }) => {
  if (!checkAuth()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default PrivateRoute;