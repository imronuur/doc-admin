// hooks
//
import { MAvatar } from '../../../../components/@material-extend';
import createAvatar from '../../../../utils/createAvatar';

// ----------------------------------------------------------------------

export default function ClientAvatar({ client }) {
  return (
    <>
      {client.length > 0 &&
        client.map((item, index) => (
          <MAvatar
            key={index}
            src={item.photoURL}
            alt={item.name}
            color={item.photoURL ? 'default' : createAvatar(item.name).color}
            {...item}
          >
            {createAvatar(item.name).name}
          </MAvatar>
        ))}
    </>
  );
}
