import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("../views/Launcher.vue"),
  },
  {
    path: "/launcher",
    component: () => import("../views/Launcher.vue"),
  },
  {
    path: "/setting",
    component: () => import("../views/Setting/Setting.vue"),
    children: [
      {
        path: "game",
        component: () => import("../views/Setting/components/Game.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
