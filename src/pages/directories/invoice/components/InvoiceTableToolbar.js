import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem, Tooltip, IconButton } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
// components
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
import { Icon } from '@iconify/react';
import Iconify from '../../../../components/Iconify';

const INPUT_WIDTH = 160;

InvoiceTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterService: PropTypes.string,
  filterEndDate: PropTypes.instanceOf(Date),
  filterStartDate: PropTypes.instanceOf(Date),
  onFilterName: PropTypes.func,
  onFilterEndDate: PropTypes.func,
  onFilterService: PropTypes.func,
  onFilterStartDate: PropTypes.func,
  optionsService: PropTypes.arrayOf(PropTypes.string),
  handleDeleteMany: PropTypes.func,
  loading: PropTypes.bool,
  selected: PropTypes.array
};

export default function InvoiceTableToolbar({
  optionsService,
  filterStartDate,
  filterEndDate,
  filterName,
  filterService,
  onFilterName,
  onFilterService,
  onFilterStartDate,
  onFilterEndDate,
  handleDeleteMany,
  selected,
  loading
}) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        select
        label="Service type"
        value={filterService}
        onChange={onFilterService}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } }
          }
        }}
        sx={{
          maxWidth: { md: INPUT_WIDTH },
          textTransform: 'capitalize'
        }}
      >
        {optionsService.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize'
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>

      <DatePicker
        label="Start date"
        value={filterStartDate}
        onChange={onFilterStartDate}
        renderInput={(params) => (
          <TextField
            type="date"
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH }
            }}
          />
        )}
      />

      <DatePicker
        label="End date"
        value={filterEndDate}
        onChange={onFilterEndDate}
        renderInput={(params) => (
          <TextField
            type="date"
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH }
            }}
          />
        )}
      />

      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Search client or invoice number..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          )
        }}
      />
      {selected.length > 0 ? (
        <Tooltip title="Delete">
          <IconButton disabled={loading} onClick={() => handleDeleteMany(selected)}>
            <Icon icon={trash2Fill} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Icon icon={roundFilterList} />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}
