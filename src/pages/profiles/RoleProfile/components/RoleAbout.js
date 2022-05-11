import PropTypes from 'prop-types';

import { Grid, Typography, Card } from '@mui/material';
import { sentenceCase } from 'sentence-case';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

RoleAbout.propTypes = {
  role: PropTypes.object
};

export default function RoleAbout({ role }) {
  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        {role.name}
      </Grid>
      <Grid item xs={12} md={6}>
        {role.permissions.map((res, i) => (
          <Card sx={{ margin: '1%' }} key={i}>
            <Typography sx={{ p: '1%' }}> {sentenceCase(res)} </Typography>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
}
