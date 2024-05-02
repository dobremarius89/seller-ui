import {createRouter, createWebHistory} from "vue-router";
import LoginPage from "@/pages/LoginPage.vue";
import HomePage from "@/pages/HomePage.vue";
import LogoutPage from "@/pages/LogoutPage.vue";

export const Route = {
    HOME: "home",
    LOGIN: "login",
    LOGOUT: "logout"
};

const Path = {
    HOME: "/home",
    LOGIN: "/login",
    LOGOUT: "/logout"
};

const router = createRouter( {
    history: createWebHistory(),
    routes: [
        {
            path: Path.HOME,
            name: Route.HOME,
            component: HomePage
        },
        {
            path: Path.LOGIN,
            name: Route.LOGIN,
            component: LoginPage
        },
        {
            path: Path.LOGOUT,
            name: Route.LOGOUT,
            component: LogoutPage
        }
    ]
});

export default router;
