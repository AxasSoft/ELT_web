import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/t/courses'
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
    path: '/k/courses/:course_id/kb',
    component: () => import ('../views/Knowledge.vue')
  },
  {
    path: '/t/courses/:course_id/categories',
    component: () => import ('../views/Categories.vue')
  },
  {
    path: '/s/statistics/',
    component: () => import ('../views/Statistics.vue')
  },
  {
    path: '/s:i/statistics/:entity/',
    component: () => import ('../views/Statistics.vue')
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
    path: '/t/courses',
    component: () => import('../views/CoursesForCategories.vue')
  },
  {
    path: '/k/courses',
    component: () => import('../views/CoursesForLevels.vue')
  },
  {
    path: '/profile',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/g/settings',
    component: () => import('../views/Settings.vue')
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
