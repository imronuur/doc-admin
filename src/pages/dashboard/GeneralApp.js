import { useState, useEffect } from 'react';
// material
import { Container, Grid, Stack } from '@mui/material';
// hooks
import { useSelector } from 'react-redux';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { getAllProducts } from '../../redux/slices/products';
import { getAllUsers } from '../../redux/slices/usersSlice';
import { getAllCategories, getAllSubCategories } from '../../redux/slices/subCategories';

import {
  AppWelcome,
  AppFeatured,
  AppTotalCategoriesAndSubCategories,
  AppTotalUsers,
  AppTotalProducts,
  EcommerceYearlySales,
  EcommerceSalesProfit,
  EcommerceSaleByGender,
  EcommerceProductSold,
  AnalyticsCurrentVisits
} from '../../components/_dashboard/general-app';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { themeStretch } = useSettings();
  const { user } = useSelector((state) => state.auth);
  const [totalProducts, setTotalProducts] = useState([]);
  const [totalUsers, setTotalUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  // useEffect api request that fetchs all products from the database
  useEffect(() => {
    let isSubscribed = true;

    if (isSubscribed) {
      const loadAllProducts = async () => {
        const reqObject = {
          accessToken: user.token
        };
        const res = await getAllProducts(reqObject);
        setTotalProducts(res.data);
      };
      const loadAllUsers = async () => {
        const reqObject = {
          accessToken: user.token
        };
        const userRes = await getAllUsers(reqObject);
        setTotalUsers(userRes.data);
      };
      const loadCategories = async () => {
        const res = await getAllCategories();
        setCategories(res.data);
      };
      const loadSubCategories = async () => {
        const res = await getAllSubCategories();
        setSubCategories(res.data);
      };
      loadAllProducts();
      loadAllUsers();
      loadCategories();
      loadSubCategories();
    }
    return () => (isSubscribed = false);
  }, [user.token]);

  return (
    <Page title="General: App | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome displayName={user.name} />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppFeatured />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalProducts totalProducts={totalProducts.data} />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalUsers totalUsers={totalUsers} />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalCategoriesAndSubCategories totalCategories={categories} totalSubCategories={subCategories} />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <EcommerceProductSold />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <EcommerceSalesProfit />
          </Grid>

          <Grid item xs={12} lg={6}>
            <EcommerceSaleByGender />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AnalyticsCurrentVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <EcommerceYearlySales />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
