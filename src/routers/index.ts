import {createRouter, createWebHistory} from "vue-router";


const Routers = createRouter({
    history: createWebHistory(),
    routes: [
        {path: "/", component: () => import("../views/Home.vue")},
        {path: '/:pathMatch(.*)*', component: () => import("../views/Home.vue")}
    ],
    linkActiveClass: 'active',
    linkExactActiveClass: 'active',
})

export default Routers;
