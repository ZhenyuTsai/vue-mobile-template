import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    props: true,
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    meta: { wxAuth: true, title: '首页', hideTabBar: false }
  },
  {
    path: '/about',
    name: 'About',
    props: true,
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: { wxAuth: true, title: '关于', hideTabBar: false }
  },
  {
    path: '*',
    name: 'Error',
    component: () => import(/* webpackChunkName: "error" */ '../views/error.vue'),
    meta: { wxAuth: true, title: '404', hideTabBar: true }
  }]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
