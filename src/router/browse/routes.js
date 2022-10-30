export default [
    {
        path: '/browse/custom-gallery/:customGallery',
        component: () => import('@/router/browse/routes/Browse.vue'),
    },
    {
        path: '/browse/:category?/:subCategory?',
        component: () => import('@/router/browse/routes/Browse.vue'),
    },
    {
        path: '/browse',
        component: () => import('@/router/browse/routes/Browse.vue'),
    }
]
