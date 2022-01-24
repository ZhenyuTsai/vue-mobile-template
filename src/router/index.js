import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    props: true,
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    meta: { wxAuth: true, title: '首页' }
  },
  {
    path: '/about',
    name: 'About',
    props: true,
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: { wxAuth: true, title: '关于' }
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "error" */ '../views/error.vue'),
    meta: { wxAuth: true, title: '404' }
  }]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
