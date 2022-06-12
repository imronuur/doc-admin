import { Icon } from '@iconify/react';

// icons
import roundSpaceDashboard from '@iconify/icons-ic/round-space-dashboard';
import roundShoppingCart from '@iconify/icons-ic/round-shopping-cart';
import roundCategory from '@iconify/icons-ic/round-category';
import roundPeopleAlt from '@iconify/icons-ic/round-people-alt';
import roundInventory2 from '@iconify/icons-ic/round-inventory-2';
import roundMessage from '@iconify/icons-ic/round-message';
import roundPercentage from '@iconify/icons-ic/round-percentage';
import roundLocalOffer from '@iconify/icons-ic/round-local-offer';
import outlineAdsClick from '@iconify/icons-ic/outline-ads-click';
import roundSecurity from '@iconify/icons-ic/round-security';
import roundSupervisedUserCircle from '@iconify/icons-ic/round-supervised-user-circle';
import roundPostAdd from '@iconify/icons-ic/round-post-add';

import SvgIconStyle from '../../components/SvgIconStyle';
import { PATH_ADMIN } from '../../routes/paths';

// ----------------------------------------------------------------------

const getIconify = (name) => <Icon width={100} height={100} icon={name} />;
const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  overview: getIconify(roundSpaceDashboard),
  products: getIconify(roundShoppingCart),
  categories: getIconify(roundCategory),
  clients: getIconify(roundPeopleAlt),
  invoices: getIconify(roundInventory2),
  orders: getIconify(roundMessage),
  coupon: getIconify(roundPercentage),
  blog: getIconify(roundPostAdd),
  roundLocalOffer: getIconify(roundLocalOffer),
  brands: getIconify(outlineAdsClick),
  roles: getIconify(roundSecurity),
  users: getIconify(roundSupervisedUserCircle)
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
      { title: 'Blogs', path: PATH_ADMIN.directories.blogs, icon: ICONS.blog },
      // { title: 'Categories', path: PATH_ADMIN.directories.categories, icon: ICONS.categories },
      // { title: 'Clients', path: PATH_ADMIN.directories.clients, icon: ICONS.clients },
      // { title: 'Invoices', path: PATH_ADMIN.directories.invoices, icon: ICONS.invoices },
      // { title: 'Orders', path: PATH_ADMIN.directories.orders, icon: ICONS.orders },
      // { title: 'Special Offers', path: PATH_ADMIN.directories.offers, icon: ICONS.roundLocalOffer },
      // { title: 'Brands', path: PATH_ADMIN.directories.brands, icon: ICONS.brands },
      // { title: 'Coupon Codes', path: PATH_ADMIN.directories.couponCode, icon: ICONS.coupon },
      { title: 'Roles and Permissions', path: PATH_ADMIN.directories.roles, icon: ICONS.roles },
      { title: 'Users', path: PATH_ADMIN.directories.users, icon: ICONS.users }
    ]
  }
];

export default sidebarConfig;
