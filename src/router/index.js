import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path:'',
    component: () => import('@/views/login/index'),
    name:'login'
  }
  
  
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  
  {
    path: '/blockbrowser',
    component: Layout,
    redirect: '/blockbrowser/index',
    children: [{
      path: 'index',
      component: () => import('@/views/blockbrowser/index'),
      name: 'blockbrowser',
      meta: { title: '区块浏览', icon: 'documentation', noCache: true }
    }]
  },
  {
    path: '/manageuser',
    component: Layout,
    redirect: '/manageuser/index',
    // alwaysShow: true,
     // will always show the root menu
    // meta: {
    //   title: '用户管理',
    //   icon: 'user'
    // },
    children: [{
      path: 'index',
      component: () => import('@/views/manageuser/index'),
      name: 'manageuser',
      meta: {
        title: '用户管理',
        icon: 'user' 
      }
    }]
  },
  {
    path: '/authority',
    component: Layout,
    children: [
      { path: 'AdminAuthority', 
      component: () => import('@/views/authority/AdminAuthority'), 
      name: 'AdminAuthority', 
      meta: { 
        title: '管理员管理', 
        icon:'people',
        roles: ['Superadmin', 'Aadmin']  
      }}
    ]
  },
  {
    path: '/personal',
    component: Layout,
    children: [{
      path: 'personal',
      component: () => import('@/views/personal/index'),
      name: 'personal',
      meta: { 
        title: '个人信息管理', 
        icon: 'icon', 
        noCache: true,
        roles: ['Aadmin','Badmin']  
       }
    }]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/index',
    children: [{
      path: 'index',
      component: () => import('@/views/notice/index'),
      name: 'notice',
      meta: { title: '通知管理', icon: 'guide', noCache: true }
    }]
  },

  {
    path: '/export-selected-excel', 
    component: () => import('@/views/notice/selectExcel'), 
    name: 'selectExcel', 
    meta: { title: "用户选择" }
  },

  {
    path: '/postNotice', 
    component: () => import('@/views/notice/postNotice'), 
    name: 'postNotice', 
    meta: { title: "发布新通知" }
  }
]

