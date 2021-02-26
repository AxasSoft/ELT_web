import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/t/categories'
  },
  {
    path: '/u/users',
    component: () => import ('../views/Users.vue')
  },
  {
    path: '/c/contacts',
    component: () => import ('../views/Contacts.vue')
  },
  {
    path: '/k/kb',
    component: () => import ('../views/Knowledge.vue')
  },
  {
    path: '/t/categories',
    component: () => import ('../views/Categories.vue')
  },
  {
    path: '/t/categories/:category_id',
    component: () => import ('../views/Tests.vue')
  },
  {
    path: '/t/tests/:test_id',
    component: () => import ('../views/Questions.vue')
  },
  {
    path: '/k/kb/:level_id',
    component: () => import('../views/Phases.vue')
  },
  {
    path: '/k/phases/:phase_id',
    component: () => import('../views/Lessons.vue')
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('../views/Login.vue')
  },
  {
    name: 'NotFound',
    path: "/:catchAll(.*)",
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
