import Vue from "vue";
import VueRouter from "vue-router";


Vue.use(VueRouter);

const routes = [{
        path: "/",
        redirect: "login" //重定向路由
    },
    {
        path: "/login",
        name: "Login",
        component: () =>
            import ("../views/login/index.vue")
    }
];

const router = new VueRouter({
    routes
});

export default router;