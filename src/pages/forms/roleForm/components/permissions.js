export const permissionsList = [
  {
    title: 'Blogs',
    id: '0001',
    operations: [
      { name: 'Can Create Or Update Blog', value: 'canCreateOrUpdateBlog' },
      { name: 'Can Delete Blog', value: 'canDeleteBlog' },
      { name: 'Can List Blogs', value: 'canListBlogs' }
    ]
  },
  {
    title: 'User',
    id: '0005',
    operations: [
      { name: 'Can Create Or Update User', value: 'canCreateOrUpdateUser' },
      { name: 'Can Delete User', value: 'canDeleteUser' },
      { name: 'Can List Users', value: 'canListUsers' },
      { name: 'Can See User Orders', value: 'canSeeUserOrders' },
      { name: 'Can See User Invoices', value: 'canSeeUserInvoices' },
      { name: 'Can Update User Role', value: 'canUpdateUserRole' }
    ]
  },

  {
    title: 'Role',
    id: '0011',
    operations: [
      { name: 'Can Create Or Update Role', value: 'canCreateOrUpdateRole' },
      { name: 'Can List Roles', value: 'canListRoles' },
      { name: 'Can List All Roles', value: 'canListAllRoles' },
      { name: 'Can Read Role', value: 'canReadRole' },
      { name: 'Can Delete Role', value: 'canDeleteRole' }
    ]
  }
];
