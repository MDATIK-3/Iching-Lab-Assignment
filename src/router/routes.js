const routes = [
  // Public - root redirects to login
  {
    path: '/',
    redirect: '/login',
  },

  // Login
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/auth/LoginPage.vue') }],
  },

  // Protected
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/app/restaurant',
      },
      {
        path: 'restaurant',
        component: () => import('src/pages/restaurant/RestaurantSetupPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'items',
        component: () => import('src/pages/items/ItemsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'orders',
        component: () => import('src/pages/orders/OrdersPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'invoices',
        component: () => import('src/pages/invoices/InvoicesPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  // 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
