const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      { path: "Tracking", component: () => import("pages/Tracking.vue") },
      { path: "Settings", component: () => import("pages/Settings.vue") },
      { path: "Party", component: () => import("pages/Party.vue") }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
