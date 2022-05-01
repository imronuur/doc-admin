// hooks
//
import { MAvatar } from '../../../../components/@material-extend';
import createAvatar from '../../../../utils/createAvatar';

// ----------------------------------------------------------------------

export default function ClientAvatar({ client, ...other }) {
  return (
    <>
      {client.length > 0 && (
        <MAvatar
          src={client.photoURL}
          alt={client.name}
          color={client.photoURL ? 'default' : createAvatar(client.name).color}
          {...other}
        >
          {createAvatar(client.name).name}
        </MAvatar>
      )}
    </>
  );
}
