import { useState } from 'react';
import PropTypes from 'prop-types';
// hooks//
import { MAvatar } from '../../../../components/@material-extend';
import createAvatar from '../../../../utils/createAvatar';

// ----------------------------------------------------------------------

ClientAvatar.propTypes = {
  client: PropTypes.object
};

export default function ClientAvatar({ client, ...other }) {
  const [avatar] = useState([client]);

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
