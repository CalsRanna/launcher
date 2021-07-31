import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("../views/Launcher"),
  },
  {
    path: "/launcher",
    component: () => import("../views/Launcher"),
  },
  {
    path: "/configuration-editor",
    component: () => import("../views/ConfigurationEditor/ConfigurationEditor"),
    children: [
      {
        path: "auth-server",
        component: () =>
          import("../views/ConfigurationEditor/components/AuthServer"),
      },
      {
        path: "world-server",
        component: () =>
          import("../views/ConfigurationEditor/components/WorldServer"),
      },
    ],
  },
  {
    path: "/setting",
    component: () => import("../views/Setting/Setting"),
    children: [
      {
        path: "software",
        component: () => import("../views/Setting/components/Software"),
      },
      {
        path: "game",
        component: () => import("../views/Setting/components/Game"),
      },
      {
        path: "about",
        component: () => import("../views/Setting/components/About"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
