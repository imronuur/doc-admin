import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import blogReducer from './slices/blog';
import userReducer from './slices/user';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import categoryReducer from './slices/categories';
import bulkCategoriesReducer from './slices/bulkCategories';
import authReducer from './slices/authSlice';
import subCategoryReducer from './slices/subCategories';
import productReducer from './slices/products';
import bulkProductsReducer from './slices/bulkProducts';
import couponReducer from './slices/couponSlice';
import clientReducer from './slices/clients';
import invoiceReducer from './slices/invoiceSlice';
import orderReducer from './slices/orderSlice';
import offerReducer from './slices/offerSlice';
// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [
    'auth',
    'bulkCategory',
    'subCategory',
    'product',
    'bulkProduct',
    'coupon',
    'client',
    'invoice',
    'order',
    'offer'
  ]
};

const categoryPersistConfig = {
  key: 'category',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['category']
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  blog: blogReducer,
  user: userReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  category: persistReducer(categoryPersistConfig, categoryReducer),
  bulkCategory: bulkCategoriesReducer,
  bulkProduct: bulkProductsReducer,
  subCategory: subCategoryReducer,
  product: productReducer,
  auth: authReducer,
  coupon: couponReducer,
  client: clientReducer,
  invoice: invoiceReducer,
  order: orderReducer,
  offer: offerReducer
});

export { rootPersistConfig, rootReducer };
