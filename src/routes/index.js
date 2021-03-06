import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';
// components
import LoadingScreen from '../components/LoadingScreen';
import { PATH_ADMIN } from './paths';
// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify', element: <VerifyCode /> }
      ]
    },

    {
      path: 'admin',
      element: (
        <AuthGuard>
          <RoleBasedGuard accessibleRoles={['admin', 'brandManager', 'superAdmin']}>
            <DashboardLayout />
          </RoleBasedGuard>
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={`${PATH_ADMIN.directories.overview}`} replace /> },
        { path: `${PATH_ADMIN.profiles.adminProfile}`, element: <UserProfile /> },
        // Directories
        { path: `${PATH_ADMIN.directories.overview}`, element: <GeneralApp /> },
        { path: `${PATH_ADMIN.directories.products}`, element: <ProductList /> },
        { path: `${PATH_ADMIN.directories.categories}`, element: <CategoryList /> },
        { path: `${PATH_ADMIN.directories.clients}`, element: <Clients /> },
        { path: `${PATH_ADMIN.directories.invoices}`, element: <Invoices /> },
        { path: `${PATH_ADMIN.directories.offers}`, element: <SpecialOffers /> },
        { path: `${PATH_ADMIN.directories.blogs}`, element: <BlogPosts /> },

        {
          path: `${PATH_ADMIN.directories.brands}`,
          element: <Brands />
        },
        {
          path: `${PATH_ADMIN.directories.roles}`,
          element: (
            <RoleBasedGuard accessibleRoles={['superAdmin']}>
              <Roles />
            </RoleBasedGuard>
          )
        },
        {
          path: `${PATH_ADMIN.directories.users}`,
          element: (
            <RoleBasedGuard accessibleRoles={['superAdmin', 'admin']}>
              <Users />
            </RoleBasedGuard>
          )
        },

        { path: `${PATH_ADMIN.directories.orders}`, element: <Orders /> },
        { path: `${PATH_ADMIN.directories.couponCode}`, element: <CouponCodeList /> },
        // Forms
        { path: `${PATH_ADMIN.forms.newCategory}`, element: <CategoryForm /> },
        { path: `${PATH_ADMIN.forms.editCategory}/:_id`, element: <CategoryForm /> },
        { path: `${PATH_ADMIN.forms.editBulkCategory}/:id`, element: <CategoryBulkEdit /> },

        { path: `${PATH_ADMIN.forms.newSubCategory}`, element: <NewSubCategory /> },
        { path: `${PATH_ADMIN.forms.editSubCategory}/:_id`, element: <NewSubCategory /> },

        { path: `${PATH_ADMIN.forms.newProduct}`, element: <ProductForm /> },
        { path: `${PATH_ADMIN.forms.editProduct}/:_id`, element: <ProductForm /> },

        // profiles
        { path: `${PATH_ADMIN.profiles.clientProfile}/:_id`, element: <ClientProfilePage /> },
        { path: `${PATH_ADMIN.profiles.orderProfile}/:_id`, element: <OrderProfilePage /> },
        { path: `${PATH_ADMIN.profiles.invoiceProfile}/:_id`, element: <InvoiceDetails /> },
        { path: `${PATH_ADMIN.profiles.productProfile}/:_id`, element: <ProductProfilePage /> },
        { path: `${PATH_ADMIN.profiles.roleProfile}/:_id`, element: <RoleProfile /> },
        { path: `${PATH_ADMIN.profiles.userprofile}/:_id`, element: <UsersProfile /> },
        { path: `${PATH_ADMIN.profiles.blogProfile}/:_id`, element: <BlogProfile /> },
        // checkout

        { path: `${PATH_ADMIN.forms.newCoupon}`, element: <NewCouponForm /> },
        { path: `${PATH_ADMIN.forms.editCoupon}/:_id`, element: <NewCouponForm /> },
        { path: `${PATH_ADMIN.forms.newClients}`, element: <NewClientsForm /> },
        { path: `${PATH_ADMIN.forms.editClients}/:_id`, element: <NewClientsForm /> },
        { path: `${PATH_ADMIN.forms.newInvoice}`, element: <NewInvoiceForm /> },
        { path: `${PATH_ADMIN.forms.editInvoice}/:_id`, element: <NewInvoiceForm /> },
        { path: `${PATH_ADMIN.forms.newOffer}`, element: <SpecialOffersForm /> },
        { path: `${PATH_ADMIN.forms.editOffer}/:_id`, element: <SpecialOffersForm /> },
        { path: `${PATH_ADMIN.forms.newBrand}`, element: <BrandsForm /> },
        { path: `${PATH_ADMIN.forms.newBlog}`, element: <BlogForm /> },

        { path: `${PATH_ADMIN.forms.editBrand}/:_id`, element: <BrandsForm /> },
        {
          path: `${PATH_ADMIN.forms.newRole}`,
          element: (
            <RoleBasedGuard accessibleRoles={['superAdmin']}>
              <RolesForm />
            </RoleBasedGuard>
          )
        },
        {
          path: `${PATH_ADMIN.forms.editRole}/:_id`,
          element: (
            <RoleBasedGuard accessibleRoles={['superAdmin']}>
              <RolesForm />
            </RoleBasedGuard>
          )
        },
        {
          path: `${PATH_ADMIN.forms.newUser}`,
          element: (
            <RoleBasedGuard accessibleRoles={['superAdmin']}>
              <UserForm />
            </RoleBasedGuard>
          )
        },
        {
          path: `${PATH_ADMIN.forms.editUser}/:_id`,
          element: (
            <RoleBasedGuard accessibleRoles={['superAdmin']}>
              <UserForm />
            </RoleBasedGuard>
          )
        }
      ]
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <GeneralApp /> },
        { path: 'ecommerce', element: <GeneralEcommerce /> },
        { path: 'analytics', element: <GeneralAnalytics /> },
        { path: 'banking', element: <GeneralBanking /> },
        { path: 'booking', element: <GeneralBooking /> },

        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/dashboard/e-commerce/shop" replace /> },
            { path: 'shop', element: <EcommerceShop /> },
            { path: 'product/:name', element: <EcommerceProductDetails /> },
            { path: 'list', element: <ProductList /> },
            { path: 'checkout', element: <EcommerceCheckout /> },
            { path: 'invoice', element: <EcommerceInvoice /> }
          ]
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user" replace /> },
            { path: 'profile', element: <UserProfile /> },
            { path: 'cards', element: <UserCards /> },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: ':name/edit', element: <UserCreate /> },
            { path: 'account', element: <UserAccount /> }
          ]
        },
        {
          path: 'blog',
          children: [
            { element: <Navigate to="/dashboard/blog/posts" replace /> },
            { path: 'posts', element: <BlogPosts /> },
            { path: 'post/:_id', element: <BlogPost /> },
            { path: 'new-post', element: <BlogNewPost /> }
          ]
        },
        {
          path: 'mail',
          children: [
            { element: <Navigate to="/dashboard/mail/all" replace /> },
            { path: 'label/:customLabel', element: <Mail /> },
            { path: 'label/:customLabel/:mailId', element: <Mail /> },
            { path: ':systemLabel', element: <Mail /> },
            { path: ':systemLabel/:mailId', element: <Mail /> }
          ]
        },
        {
          path: 'chat',
          children: [
            { element: <Chat /> },
            { path: 'new', element: <Chat /> },
            { path: ':conversationKey', element: <Chat /> }
          ]
        },
        { path: 'calendar', element: <Calendar /> },
        { path: 'kanban', element: <Kanban /> }
      ]
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: 'pricing', element: <Pricing /> },
        { path: 'payment', element: <Payment /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { element: <LandingPage /> },
        { path: 'about-us', element: <About /> },
        { path: 'contact-us', element: <Contact /> },
        { path: 'faqs', element: <Faqs /> },
        {
          path: 'components',
          children: [
            { element: <ComponentsOverview /> },
            // FOUNDATIONS
            { path: 'color', element: <Color /> },
            { path: 'typography', element: <Typography /> },
            { path: 'shadows', element: <Shadows /> },
            { path: 'grid', element: <Grid /> },
            { path: 'icons', element: <Icons /> },
            // MATERIAL UI
            { path: 'accordion', element: <Accordion /> },
            { path: 'alert', element: <Alert /> },
            { path: 'autocomplete', element: <Autocomplete /> },
            { path: 'avatar', element: <Avatar /> },
            { path: 'badge', element: <Badge /> },
            { path: 'breadcrumbs', element: <Breadcrumb /> },
            { path: 'buttons', element: <Buttons /> },
            { path: 'checkbox', element: <Checkbox /> },
            { path: 'chip', element: <Chip /> },
            { path: 'dialog', element: <Dialog /> },
            { path: 'label', element: <Label /> },
            { path: 'list', element: <List /> },
            { path: 'menu', element: <Menu /> },
            { path: 'pagination', element: <Pagination /> },
            { path: 'pickers', element: <Pickers /> },
            { path: 'popover', element: <Popover /> },
            { path: 'progress', element: <Progress /> },
            { path: 'radio-button', element: <RadioButtons /> },
            { path: 'rating', element: <Rating /> },
            { path: 'slider', element: <Slider /> },
            { path: 'snackbar', element: <Snackbar /> },
            { path: 'stepper', element: <Stepper /> },
            { path: 'switch', element: <Switches /> },
            { path: 'table', element: <Table /> },
            { path: 'tabs', element: <Tabs /> },
            { path: 'textfield', element: <Textfield /> },
            { path: 'timeline', element: <Timeline /> },
            { path: 'tooltip', element: <Tooltip /> },
            { path: 'transfer-list', element: <TransferList /> },
            { path: 'tree-view', element: <TreeView /> },
            { path: 'data-grid', element: <DataGrid /> },
            // EXTRA COMPONENTS
            { path: 'chart', element: <Charts /> },
            { path: 'map', element: <Map /> },
            { path: 'editor', element: <Editor /> },
            { path: 'copy-to-clipboard', element: <CopyToClipboard /> },
            { path: 'upload', element: <Upload /> },
            { path: 'carousel', element: <Carousel /> },
            { path: 'multi-language', element: <MultiLanguage /> },
            { path: 'animate', element: <Animate /> },
            { path: 'mega-menu', element: <MegaMenu /> },
            { path: 'form-validation', element: <FormValidation /> }
          ]
        }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../pages/authentication/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/authentication/VerifyCode')));

// Directories
const ProductList = Loadable(lazy(() => import('../pages/directories/products/Products')));
const CategoryList = Loadable(lazy(() => import('../pages/directories/categories/Categories')));
const CouponCodeList = Loadable(lazy(() => import('../pages/directories/coupon/CouponCode')));
const Clients = Loadable(lazy(() => import('../pages/directories/clients/Clients')));
const Invoices = Loadable(lazy(() => import('../pages/directories/invoice/Invoices')));
const Orders = Loadable(lazy(() => import('../pages/directories/Orders/Orders')));
const SpecialOffers = Loadable(lazy(() => import('../pages/directories/specialOffers/SpecialOffers')));
const Brands = Loadable(lazy(() => import('../pages/directories/brands/Brands')));
const Roles = Loadable(lazy(() => import('../pages/directories/role/Role')));
const Users = Loadable(lazy(() => import('../pages/directories/users/Users')));
const BlogPosts = Loadable(lazy(() => import('../pages/directories/blogs/BlogPosts')));
// Form

const CategoryForm = Loadable(lazy(() => import('../pages/forms/categoryForm/CategoryForm')));
const BlogForm = Loadable(lazy(() => import('../pages/directories/blogs/BlogNewPost')));
const CategoryBulkEdit = Loadable(lazy(() => import('../pages/forms/bulk/bulkCategoryForm/BulkCategoryForm')));
const NewSubCategory = Loadable(lazy(() => import('../pages/forms/subCategoryForm/SubCategoryForm')));
const NewCouponForm = Loadable(lazy(() => import('../pages/forms/couponForm/CouponForm')));
const ProductForm = Loadable(lazy(() => import('../pages/forms/productForm/ProductForm')));
const NewClientsForm = Loadable(lazy(() => import('../pages/forms/clientsForm/clientsForm')));
const NewInvoiceForm = Loadable(lazy(() => import('../pages/forms/invoice/InvoiceForm')));
const SpecialOffersForm = Loadable(lazy(() => import('../pages/forms/specialOffers/OffersForm')));
const BrandsForm = Loadable(lazy(() => import('../pages/forms/brandsForm/BrandsForm')));
const RolesForm = Loadable(lazy(() => import('../pages/forms/roleForm/RoleForm')));
const UserForm = Loadable(lazy(() => import('../pages/forms/userForm/UserForm')));

// profiles
const BlogProfile = Loadable(lazy(() => import('../pages/directories/blogs/BlogPost')));
const ClientProfilePage = Loadable(lazy(() => import('../pages/profiles/ClientProfile/ClientProfilePage')));
const InvoiceProfilePage = Loadable(lazy(() => import('../pages/profiles/InvoiceProfile/InvoiceProfilePage')));
const InvoiceDetails = Loadable(lazy(() => import('../pages/profiles/InvoiceProfile/InvoiceDetails')));
const OrderProfilePage = Loadable(lazy(() => import('../pages/profiles/OrdersProfile/OrderProfilePage')));
const ProductProfilePage = Loadable(lazy(() => import('../pages/profiles/productProfile/ProductProfilePage')));
const RoleProfile = Loadable(lazy(() => import('../pages/profiles/RoleProfile/RoleProfile')));
const UsersProfile = Loadable(lazy(() => import('../pages/profiles/UserProfile/UserProfile')));

// checkout

// Dashboard
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const GeneralEcommerce = Loadable(lazy(() => import('../pages/dashboard/GeneralEcommerce')));
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
const GeneralBanking = Loadable(lazy(() => import('../pages/dashboard/GeneralBanking')));
const GeneralBooking = Loadable(lazy(() => import('../pages/dashboard/GeneralBooking')));
const EcommerceShop = Loadable(lazy(() => import('../pages/dashboard/EcommerceShop')));
const EcommerceProductDetails = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductDetails')));
const EcommerceCheckout = Loadable(lazy(() => import('../pages/dashboard/EcommerceCheckout')));
const EcommerceInvoice = Loadable(lazy(() => import('../pages/dashboard/EcommerceInvoice')));
// const BlogPosts = Loadable(lazy(() => import('../pages/dashboard/BlogPosts')));
const BlogPost = Loadable(lazy(() => import('../pages/dashboard/BlogPost')));
const BlogNewPost = Loadable(lazy(() => import('../pages/dashboard/BlogNewPost')));
const UserProfile = Loadable(lazy(() => import('../pages/dashboard/UserProfile')));
const UserCards = Loadable(lazy(() => import('../pages/dashboard/UserCards')));
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));
const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat')));
const Mail = Loadable(lazy(() => import('../pages/dashboard/Mail')));
const Calendar = Loadable(lazy(() => import('../pages/dashboard/Calendar')));
const Kanban = Loadable(lazy(() => import('../pages/dashboard/Kanban')));
// Main
const LandingPage = Loadable(lazy(() => import('../pages/LandingPage')));
const About = Loadable(lazy(() => import('../pages/About')));
const Contact = Loadable(lazy(() => import('../pages/Contact')));
const Faqs = Loadable(lazy(() => import('../pages/Faqs')));
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Pricing = Loadable(lazy(() => import('../pages/Pricing')));
const Payment = Loadable(lazy(() => import('../pages/Payment')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
// Components
const ComponentsOverview = Loadable(lazy(() => import('../pages/ComponentsOverview')));
const Color = Loadable(lazy(() => import('../pages/components-overview/foundations/FoundationColors')));
const Typography = Loadable(lazy(() => import('../pages/components-overview/foundations/FoundationTypography')));
const Shadows = Loadable(lazy(() => import('../pages/components-overview/foundations/FoundationShadows')));
const Grid = Loadable(lazy(() => import('../pages/components-overview/foundations/FoundationGrid')));
const Icons = Loadable(lazy(() => import('../pages/components-overview/foundations/FoundationIcons')));
const Accordion = Loadable(lazy(() => import('../pages/components-overview/material-ui/Accordion')));
const Alert = Loadable(lazy(() => import('../pages/components-overview/material-ui/Alert')));
const Autocomplete = Loadable(lazy(() => import('../pages/components-overview/material-ui/Autocomplete')));
const Avatar = Loadable(lazy(() => import('../pages/components-overview/material-ui/Avatar')));
const Badge = Loadable(lazy(() => import('../pages/components-overview/material-ui/Badge')));
const Breadcrumb = Loadable(lazy(() => import('../pages/components-overview/material-ui/Breadcrumb')));
const Buttons = Loadable(lazy(() => import('../pages/components-overview/material-ui/buttons')));
const Checkbox = Loadable(lazy(() => import('../pages/components-overview/material-ui/Checkboxes')));
const Chip = Loadable(lazy(() => import('../pages/components-overview/material-ui/chips')));
const Dialog = Loadable(lazy(() => import('../pages/components-overview/material-ui/dialog')));
const Label = Loadable(lazy(() => import('../pages/components-overview/material-ui/Label')));
const List = Loadable(lazy(() => import('../pages/components-overview/material-ui/Lists')));
const Menu = Loadable(lazy(() => import('../pages/components-overview/material-ui/Menus')));
const Pagination = Loadable(lazy(() => import('../pages/components-overview/material-ui/Pagination')));
const Pickers = Loadable(lazy(() => import('../pages/components-overview/material-ui/pickers')));
const Popover = Loadable(lazy(() => import('../pages/components-overview/material-ui/Popover')));
const Progress = Loadable(lazy(() => import('../pages/components-overview/material-ui/progress')));
const RadioButtons = Loadable(lazy(() => import('../pages/components-overview/material-ui/RadioButtons')));
const Rating = Loadable(lazy(() => import('../pages/components-overview/material-ui/Rating')));
const Slider = Loadable(lazy(() => import('../pages/components-overview/material-ui/Slider')));
const Snackbar = Loadable(lazy(() => import('../pages/components-overview/material-ui/Snackbar')));
const Stepper = Loadable(lazy(() => import('../pages/components-overview/material-ui/stepper')));
const Switches = Loadable(lazy(() => import('../pages/components-overview/material-ui/Switches')));
const Table = Loadable(lazy(() => import('../pages/components-overview/material-ui/table')));
const Tabs = Loadable(lazy(() => import('../pages/components-overview/material-ui/Tabs')));
const Textfield = Loadable(lazy(() => import('../pages/components-overview/material-ui/textfield')));
const Timeline = Loadable(lazy(() => import('../pages/components-overview/material-ui/Timeline')));
const Tooltip = Loadable(lazy(() => import('../pages/components-overview/material-ui/Tooltip')));
const TransferList = Loadable(lazy(() => import('../pages/components-overview/material-ui/transfer-list')));
const TreeView = Loadable(lazy(() => import('../pages/components-overview/material-ui/TreeView')));
const DataGrid = Loadable(lazy(() => import('../pages/components-overview/material-ui/data-grid')));
//
const Charts = Loadable(lazy(() => import('../pages/components-overview/extra/Charts')));
const Map = Loadable(lazy(() => import('../pages/components-overview/extra/Map')));
const Editor = Loadable(lazy(() => import('../pages/components-overview/extra/Editor')));
const CopyToClipboard = Loadable(lazy(() => import('../pages/components-overview/extra/CopyToClipboard')));
const Upload = Loadable(lazy(() => import('../pages/components-overview/extra/Upload')));
const Carousel = Loadable(lazy(() => import('../pages/components-overview/extra/Carousel')));
const MultiLanguage = Loadable(lazy(() => import('../pages/components-overview/extra/MultiLanguage')));
const Animate = Loadable(lazy(() => import('../pages/components-overview/extra/animate')));
const MegaMenu = Loadable(lazy(() => import('../pages/components-overview/extra/MegaMenu')));
const FormValidation = Loadable(lazy(() => import('../pages/components-overview/extra/form-validation')));
