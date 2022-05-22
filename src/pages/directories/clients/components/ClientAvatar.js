// hooks
//
import { useState } from 'react';
import PropTypes from 'prop-types';
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
        avatar.map((c, i) => (
          <MAvatar
            key={i}
            src={c.photoURL}
            alt={c.name}
            color={c.photoURL ? 'primary' : createAvatar(c.name).color}
            {...other}
          >
            {createAvatar(c.name).name}
          </MAvatar>
        ))}
    </>
  );
}
