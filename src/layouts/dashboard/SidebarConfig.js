import { Icon } from '@iconify/react';

// icons
import roundSpaceDashboard from '@iconify/icons-ic/round-space-dashboard';
import roundShoppingCart from '@iconify/icons-ic/round-shopping-cart';
import roundCategory from '@iconify/icons-ic/round-category';
import roundPeopleAlt from '@iconify/icons-ic/round-people-alt';
import roundInventory2 from '@iconify/icons-ic/round-inventory-2';
import roundMessage from '@iconify/icons-ic/round-message';

// routes
// components
import SvgIconStyle from '../../components/SvgIconStyle';
import Label from '../../components/Label';
import { PATH_DASHBOARD, PATH_ADMIN } from '../../routes/paths';

// ----------------------------------------------------------------------

const getIconify = (name) => <Icon width={100} height={100} icon={name} />;

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const icons = {};
const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
  overview: getIconify(roundSpaceDashboard),
  products: getIconify(roundShoppingCart),
  categories: getIconify(roundCategory),
  users: getIconify(roundPeopleAlt),
  invoices: getIconify(roundInventory2),
  orders: getIconify(roundMessage)
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
      { title: 'Users', path: PATH_ADMIN.directories.users, icon: ICONS.users },
      { title: 'Invoices', path: PATH_ADMIN.directories.invoices, icon: ICONS.invoices },
      { title: 'Orders', path: PATH_ADMIN.directories.orders, icon: ICONS.orders }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // MANAGEMENT : USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'profile', path: PATH_DASHBOARD.user.profile },
          { title: 'cards', path: PATH_DASHBOARD.user.cards },
          { title: 'list', path: PATH_DASHBOARD.user.list },
          { title: 'create', path: PATH_DASHBOARD.user.newUser },
          { title: 'edit', path: PATH_DASHBOARD.user.editById },
          { title: 'account', path: PATH_DASHBOARD.user.account }
        ]
      },

      // MANAGEMENT : E-COMMERCE
      {
        title: 'e-commerce',
        path: PATH_DASHBOARD.eCommerce.root,
        icon: ICONS.cart,
        children: [
          { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
          { title: 'product', path: PATH_DASHBOARD.eCommerce.productById },
          { title: 'list', path: PATH_DASHBOARD.eCommerce.list },
          { title: 'create', path: PATH_DASHBOARD.eCommerce.newProduct },
          { title: 'edit', path: PATH_DASHBOARD.eCommerce.editById },
          { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
          { title: 'invoice', path: PATH_DASHBOARD.eCommerce.invoice }
        ]
      },

      // MANAGEMENT : BLOG
      {
        title: 'blog',
        path: PATH_DASHBOARD.blog.root,
        icon: ICONS.blog,
        children: [
          { title: 'posts', path: PATH_DASHBOARD.blog.posts },
          { title: 'post', path: PATH_DASHBOARD.blog.postById },
          { title: 'new post', path: PATH_DASHBOARD.blog.newPost }
        ]
      }
    ]
  },

  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'app',
    items: [
      {
        title: 'mail',
        path: PATH_DASHBOARD.mail.root,
        icon: ICONS.mail,
        info: <Label color="error">2</Label>
      },
      { title: 'chat', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
      { title: 'calendar', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
      {
        title: 'kanban',
        path: PATH_DASHBOARD.kanban,
        icon: ICONS.kanban
      }
    ]
  }
];

export default sidebarConfig;
