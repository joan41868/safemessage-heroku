import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Chat.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/donate',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/Donate.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
