import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/requester',
  },
  {
    path: '/requester',
    name: 'requester',
    component: () => import('../views/RequesterView.vue'),
  },
  {
    path: '/expert',
    name: 'expert',
    component: () => import('../views/ExpertView.vue'),
  },
  {
    path: '/consultation/:sessionId',
    name: 'consultation',
    component: () => import('../views/ConsultationRoom.vue'),
    props: true,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
