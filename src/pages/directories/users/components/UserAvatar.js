import PropTypes from 'prop-types';
// hooks
//
import { MAvatar } from '../../../../components/@material-extend';
import createAvatar from '../../../../utils/createAvatar';

// ----------------------------------------------------------------------

UserAvatar.propTypes = {
  name: PropTypes.string,
  photo: PropTypes.string
};

export default function UserAvatar({ photo, name, ...other }) {
  return (
    <MAvatar src={photo} alt={name} color={name ? 'primary' : createAvatar(name).color} {...other}>
      {createAvatar(name).name}
    </MAvatar>
  );
}
