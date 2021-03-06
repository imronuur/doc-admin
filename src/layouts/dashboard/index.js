import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled, useTheme } from '@mui/material/styles';
// hooks
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import { useFirebaseAuth } from '../../contexts/authContext';
import { tokenCheck } from '../../redux/thunk/authThunk';

import { getAllBlogs } from '../../redux/slices/blogSlice';
import { getProducts } from '../../redux/slices/products';
import { getCoupon } from '../../redux/slices/couponSlice';
import { getClients } from '../../redux/slices/clients';
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const theme = useTheme();
  const { collapseClick } = useCollapseDrawer();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useFirebaseAuth();
  const { token } = useSelector((state) => state.auth);
  const [page] = useState(0);

  useEffect(() => {
    const reqObject = {
      page,
      accessToken: token
    };

    const handleExpiredToken = async () => {
      await logout();
      window.location.reload();
      navigate('/');
    };

    // Token Check
    const checkToken = async (token) => {
      const res = await dispatch(tokenCheck(token));
      if (res.type === 'auth/checkToken/rejected') {
        handleExpiredToken();
      }
    };

    const loadBlogs = () => dispatch(getAllBlogs());
    // const loadProducts = (req) => dispatch(getProducts(req));
    // const loadCoupon = (req) => dispatch(getCoupon(req));

    checkToken(token);
    loadBlogs();
    // loadClients(reqObject);
    // loadProducts(reqObject);
    // loadCoupon(reqObject);
  }, [dispatch, logout, navigate, token, page]);

  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle
        sx={{
          transition: theme.transitions.create('margin', {
            duration: theme.transitions.duration.complex
          }),
          ...(collapseClick && {
            ml: '102px'
          })
        }}
      >
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
