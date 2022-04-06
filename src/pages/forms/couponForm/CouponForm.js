import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { paramCase } from 'change-case';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
// material
import { Icon } from '@iconify/react';
import { Container } from '@mui/material';
import closeFill from '@iconify/icons-eva/close-fill';
import { MIconButton } from '../../../components/@material-extend';

// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { createCoupon } from '../../../redux/thunk/couponThunk';

// routes
import { PATH_DASHBOARD, PATH_ADMIN } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import CouponNewForm from './components/Form';
// ----------------------------------------------------------------------

export default function EcommerceCouponCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { _id } = useParams();

  const { coupon } = useSelector((state) => state);
  const { codes } = coupon;

  const isEdit = pathname.includes('edit');
  const currentCoupons = codes.data.find((code) => paramCase(code._id) === _id);

  const [loading, setLoading] = useState(false);
  // const [coupons, setCoupons] = useState([]);

  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleCouponCreate = async (codes) => {
    setLoading(true);
    const reqObject = {
      codes
    };
    const reduxRes = await dispatch(createCoupon(reqObject));
    if (reduxRes.type === 'coupon/create/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'coupon/create/fulfilled') {
      enqueueSnackbar(`Coupons Created!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      window.location.reload();
      setLoading(false);
      navigate(`${PATH_ADMIN.directories.couponCode}`);
    }
  };

  return (
    <Page title="Create a new coupon | iDan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new coupon' : 'Edit Coupon'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Coupons List',
              href: PATH_ADMIN.directories.couponCode
            },
            { name: !isEdit ? 'New Coupons' : currentCoupons?.name }
          ]}
        />

        <CouponNewForm
          isEdit={isEdit}
          currentCoupons={currentCoupons}
          handleCouponCreate={handleCouponCreate}
          loading={loading}
        />
      </Container>
    </Page>
  );
}
