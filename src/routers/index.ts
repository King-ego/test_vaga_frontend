import {createRouter, createWebHistory} from "vue-router";


const Routers = createRouter({
    history: createWebHistory(),
    routes: [
        {path: "/", component: () => import("../views/Home.vue")},
        {path: "/produto/:id", component: () => import("../views/DetailsProduct.vue")},
        {path: "/cart", component: () => import("../views/Cart.vue")},
        {path: '/:pathMatch(.*)*', redirect: "/"}
    ],
    linkActiveClass: 'active',
    linkExactActiveClass: 'active',
})

export default Routers;
