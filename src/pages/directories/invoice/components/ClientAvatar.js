import { useState } from 'react';
// hooks
//
import { MAvatar } from '../../../../components/@material-extend';
import createAvatar from '../../../../utils/createAvatar';

// ----------------------------------------------------------------------

export default function ClientAvatar({ client, ...other }) {
  const [avatar, setAvatar] = useState([client]);

  return (
    <>
      {avatar.length > 0 &&
        avatar.map((client, i) => (
          <MAvatar
            key={i}
            src={client.photoURL}
            alt={client.name}
            color={client.photoURL ? 'default' : createAvatar(client.name).color}
            {...other}
          >
            {createAvatar(client.name).name}
          </MAvatar>
        ))}
    </>
  );
}
