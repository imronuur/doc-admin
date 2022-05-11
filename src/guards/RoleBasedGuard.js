import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@mui/material';
import { useSelector } from '../redux/store';

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array,
  children: PropTypes.node
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const { auth } = useSelector((state) => state);
  const { user } = auth;

  const currentRole = user.role;

  if (!accessibleRoles.includes(currentRole)) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
