import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';

// material
import { useTheme, styled } from '@mui/material/styles';
import { Box, Toolbar, Typography, OutlinedInput, InputAdornment } from '@mui/material';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  selected: PropTypes.array,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

export default function UserListToolbar({ selected, filterName, onFilterName }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <RootStyle
      sx={{
        ...(selected.length > 0 && {
          color: isLight ? 'primary.main' : 'text.primary',
          bgcolor: isLight ? 'primary.lighter' : 'primary.dark'
        })
      }}
    >
      {selected.length > 0 ? (
        <Typography component="div" variant="subtitle1">
          {selected.length} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Search client..."
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      )}
    </RootStyle>
  );
}
