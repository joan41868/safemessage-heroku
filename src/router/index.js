import Vue from 'vue'
import VueRouter from 'vue-router'
import  Chat from '../views/Chat.vue'
import Index from '../views/Index.vue';
import CryptoMonitor from '../views/CryptoMonitor.vue';
Vue.use(VueRouter)

const routes = [
  {
    path: '/chat',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/donate',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/Donate.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: Index
  },
  {
    path: '/cryptoMonitor',
    name: 'CryptoMonitor',
    component: CryptoMonitor
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
