import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/login'
import Home from '@/views/home'
import Welcome from '@/views/welcome'
import NotFound from '@/views/404'
import store from '@/store'
import Article from '@/views/article'
import Image from '@/views/image'
import Publish from '@/views/publish'
import comment from '@/views/comment'
import Setting from '@/views/setting'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { path: '/login', name: 'login', component: login },
    { path: '/',
      component: Home,
      children: [
        { path: '/', name: 'welcome', component: Welcome },
        { path: '/article', name: 'article', component: Article },
        { path: '/image', name: 'image', component: Image },
        { path: '/publish', name: 'publish', component: Publish },
        { path: '/comment', name: comment, component: comment },
        { path: '/setting', name: Setting, component: Setting }
      ] },
    //   通配路由
    { path: '*', name: '404', component: NotFound }
  ]
})
router.beforeEach((to, from, next) => {
  const user = store.getUser()
  if (to.path !== '/login' && !user.token) return next('/login')
  next()
})
export default router
