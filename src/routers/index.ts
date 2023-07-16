import {createRouter, createWebHistory} from "vue-router";


const Routers = createRouter({
    history: createWebHistory(),
    routes: [
        {path: "/", name: "Home", component: () => import("../views/Home.vue")},
        {path: "/produto/:id", name: "Details", component: () => import("../views/DetailsProduct.vue")},
        {path: "/cart", name: "Cart", component: () => import("../views/Cart.vue")},
        {path: '/:pathMatch(.*)*', redirect: "/"}
    ],
    linkActiveClass: 'active',
    linkExactActiveClass: 'active',
})

export default Routers;
