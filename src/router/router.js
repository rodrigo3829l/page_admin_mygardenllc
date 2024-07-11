import { createRouter, createWebHistory } from 'vue-router'
// import { useUserStore } from '@/store/userStore.js'
// import { useUserStore } from '@/store/store';

const routes = [
    {
        path : '/',
        redirect : {name : 'login'}
    },
    {
        path : '/login',
        name : 'login',
        meta : {
            isLoged : false,
        },
        component : () => import('../components/login/pages/loginAdmin.vue')
    },
    {
        path : '/employed',
        name : 'employeds',
        meta : {
            isLoged : true,
        },
        component : () => import('../components/employeds/pages/ServicesWindow.vue')
    },
    {
        path : '/admin',
        name : 'admin',
        meta : {
            isLoged : true,
        },
        component : () => import('../components/admin/layout/AdminLayout.vue'),
        children : [
            {
                path : 'quote',
                name : 'quote',
                component : () => import('../components/admin/cotize/pages/CotizeWindow.vue')
            },
            {
                path : 'quoteservice/:id',
                name : 'quoteservice',
                component : () => import('../components/admin/cotize/pages/QuoteService.vue')
            },
            {
                path : 'info/:id',
                name : 'infoservice',
                component : () => import('../components/admin/cotize/pages/InfoService.vue')
            },
            // {
            //     path : 'predictions',
            //     name : 'predictions',
            //     component : () => import('../components/admin/predictions/pages/PredictionsViewCopy.vue')
            // },
            {
                path : 'predictions',
                name : 'predictions',
                component : () => import('../components/admin/predictions/pages/PredictionsView.vue')
            },
            {
                path : 'questions',
                name : 'questions',
                component : () => import('../components/admin/questions/pages/QuestionsView.vue')
            },
            {
                path: '',
                name: 'default-quote',
                redirect: {name: 'quote'},
            },
            {
                path : 'comments',
                name : 'comments',
                component : () => import('../components/admin/comments/pages/CommentView.vue')
            },
            {
                path : 'services',
                name : 'services',
                component : () => import('../components/admin/services/pages/ServicesView.vue')
            },
            {
                path : 'calendar',
                name : 'calendar',
                component : () => import('../components/admin/calendar/CalendarView.vue')
            },
            {
                path : 'unit',
                name : 'unit',
                component : () => import('../components/admin/units/pages/UnitVue.vue')
            },
            {
                path : 'provider',
                name : 'provider',
                component : () => import('../components/admin/provider/pages/ProviderView.vue')
            },
            {
                path : 'products',
                name : 'products',
                component : () => import('../components/admin/products/pages/ProductsView.vue')
            },
            {
                path : 'dates',
                name : 'dates',
                component : () => import('../components/admin/dates/pages/DateView.vue')
            },
        ]
    },
    {
        path : '/finance',
        name : 'finance',
        meta : {
            isLoged : true,
        },
        component : () => import('../components/finance/pages/InfoPays.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.afterEach(() => {
    window.scrollTo(0, 0);
});

router.beforeEach( async (to, from, next) =>{

    // const userStore = useUserStore();
    const needLog = to.meta.isLoged
    const token = localStorage.getItem('token')

    if(needLog && !token){
        next('login')
    } else{
        next()
    }

})
export default router