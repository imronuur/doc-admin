export const permissionsList = [
  {
    title: 'Category',
    id: '0001',
    operations: [
      { name: 'Can Create Or Update Category', value: 'canCreateOrUpdateCategory' },
      { name: 'Can Delete Category', value: 'canDeleteCategory' },
      { name: 'Can Create Bulk Categories', value: 'canCreateBulkCategories' },
      { name: 'Can Delete Multi Categories', value: 'canDeleteMultiCategories' }
    ]
  },
  {
    title: 'Sub-Category',
    id: '0002',
    operations: [
      { name: 'Can Create Or Update Sub-Category', value: 'canCreateOrUpdateSubCategory' },
      { name: 'Can Delete Sub-Categories', value: 'canDeleteSubCategories' },
      { name: 'Can Delete Multi Sub Categories', value: 'canDeleteMultiSubCategories' }
    ]
  },
  {
    title: 'Product',
    id: '0003',
    operations: [
      { name: 'Can Create Or Update Product', value: 'canCreateOrUpdateProduct' },
      { name: 'Can Delete Product', value: 'canDeleteProduct' },
      { name: 'Can Create Bulk Products', value: 'canCreateBulkProducts' },
      { name: 'Can Delete Multi Products', value: 'canDeleteMultiProducts' }
    ]
  },
  {
    title: 'Client',
    id: '0004',
    operations: [
      { name: 'Can Create Or Update Client', value: 'canCreateOrUpdateClient' },
      { name: 'Can Delete Client', value: 'canDeleteClient' },
      { name: 'Can Delete Multi Clients', value: 'canDeleteMultiClients' },
      { name: 'Can List Clients', value: 'canListClients' },
      { name: 'Can See Client Orders', value: 'canSeeClientOrders' }
    ]
  },
  {
    title: 'User',
    id: '0005',
    operations: [
      { name: 'Can Create Or Update User', value: 'canCreateOrUpdateUser' },
      { name: 'Can Delete User', value: 'canDeleteUser' },
      { name: 'Can Delete Multi Users', value: 'canDeleteMultiUsers' },
      { name: 'Can List Users', value: 'canListUsers' },
      { name: 'Can See User Orders', value: 'canSeeUserOrders' },
      { name: 'Can See User Invoices', value: 'canSeeUserInvoices' },
      { name: 'Can Update User Role', value: 'canUpdateUserRole' }
    ]
  },
  {
    title: 'Coupon Code',
    id: '0006',
    operations: [
      { name: 'Can Create Or Update Coupon', value: 'canCreateOrUpdateCoupon' },
      { name: 'Can Delete Coupon', value: 'canDeleteCoupon' },
      { name: 'Can Delete Multi Coupons', value: 'canDeleteMultiCoupons' }
    ]
  },
  {
    title: 'Invoice',
    id: '0007',
    operations: [
      { name: 'Can Create Or Update Invoice', value: 'canCreateOrUpdateInvoice' },
      { name: 'Can Delete Invoice', value: 'canDeleteInvoice' },
      { name: 'Can Delete Multi Invoices', value: 'canDeleteMultiInvoices' }
    ]
  },
  {
    title: 'Order',
    id: '0008',
    operations: [
      { name: 'Can List Orders', value: 'canListAllOrders' },
      { name: 'Can Delete Order', value: 'canDeleteOrder' },
      { name: 'Can Delete Multi Orders', value: 'canDeleteMultiOrders' },
      { name: 'Can Update Order Status', value: 'canUpdateOrderStatus' }
    ]
  },
  {
    title: 'Supper Offer',
    id: '0009',
    operations: [
      { name: 'Can Create Or Update Offer', value: 'canCreateOrUpdateOffer' },
      { name: 'Can Delete Offer', value: 'canDeleteOffer' },
      { name: 'Can Delete Multi Offers', value: 'canDeleteMultiOffers' }
    ]
  }
];
