import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useSelector } from '../redux/store';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../routes/paths';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default function GuestGuard({ children }) {
  const { auth } = useSelector((state) => state);
  const { isAuthenticated } = auth;

  if (isAuthenticated) {
    return <Navigate to={PATH_DASHBOARD.root} />;
  }

  return <>{children}</>;
}
