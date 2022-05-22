// hooks
//
import { MAvatar } from '../../../../components/@material-extend';
import createAvatar from '../../../../utils/createAvatar';

// ----------------------------------------------------------------------

export default function ClientAvatar({ name, ...other }) {
  return (
    <MAvatar src={name} alt={name} color={name ? 'primary' : createAvatar(name).color} {...other}>
      {createAvatar(name).name}
    </MAvatar>
  );
}
