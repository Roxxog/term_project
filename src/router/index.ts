
import { createRouter, createWebHistory } from 'vue-router'
import { currentUser, authReady } from '../auth'

import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import NodeDetailView from '../views/NodeDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      component: HomeView,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'nodes/:nodeId',
          name: 'node-detail',
          component: NodeDetailView,
        },
      ],
    },
    {
      path: '/login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      component: RegisterView,
      meta: { guestOnly: true },
    },
  ],
})

router.beforeEach(async (to) => {
  await authReady

  if (to.meta.requiresAuth && !currentUser.value) {
    return '/login'
  }

  if (to.meta.guestOnly && currentUser.value) {
    return '/'
  }
})

export default router
