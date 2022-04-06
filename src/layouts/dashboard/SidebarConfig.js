import { Icon } from '@iconify/react';

// icons
import roundSpaceDashboard from '@iconify/icons-ic/round-space-dashboard';
import roundShoppingCart from '@iconify/icons-ic/round-shopping-cart';
import roundCategory from '@iconify/icons-ic/round-category';
import roundPeopleAlt from '@iconify/icons-ic/round-people-alt';
import roundInventory2 from '@iconify/icons-ic/round-inventory-2';
import roundMessage from '@iconify/icons-ic/round-message';
import roundPercentage from '@iconify/icons-ic/round-percentage';

// routes
// components
import SvgIconStyle from '../../components/SvgIconStyle';
import Label from '../../components/Label';
import { PATH_DASHBOARD, PATH_ADMIN } from '../../routes/paths';

// ----------------------------------------------------------------------

const getIconify = (name) => <Icon width={100} height={100} icon={name} />;

const ICONS = {
  overview: getIconify(roundSpaceDashboard),
  products: getIconify(roundShoppingCart),
  categories: getIconify(roundCategory),
  users: getIconify(roundPeopleAlt),
  invoices: getIconify(roundInventory2),
  orders: getIconify(roundMessage),
  coupon: getIconify(roundPercentage)
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Management',
    items: [
      {
        title: 'Overview',
        path: PATH_ADMIN.directories.overview,
        icon: ICONS.overview
      },
      { title: 'Products', path: PATH_ADMIN.directories.products, icon: ICONS.products },
      { title: 'Categories', path: PATH_ADMIN.directories.categories, icon: ICONS.categories },
      { title: 'Clients', path: PATH_ADMIN.directories.clients, icon: ICONS.users },
      { title: 'Invoices', path: PATH_ADMIN.directories.invoices, icon: ICONS.invoices },
      { title: 'Orders', path: PATH_ADMIN.directories.orders, icon: ICONS.orders },
      { title: 'Coupon Codes', path: PATH_ADMIN.directories.couponCode, icon: ICONS.coupon }
    ]
  }
];

export default sidebarConfig;
