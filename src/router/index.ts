import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/blog', component: () => import('@/views/Blog.vue') },
  {path: '/blog/:id', component: () => import('@/views/BlogDetail.vue') },
  { path: '/japanese', component: () => import('@/views/Japanese.vue') },
  { path: '/japanese/:id', component: () => import('@/views/JapaneseDetail.vue') },
  {path: '/exercise', component: () => import('@/views/Exercise.vue') },
  { path: '/eju', component: () => import('@/views/EJU.vue') },
  { path: '/eju/:id', component: () => import('@/views/EJUDetail.vue') },
  { path: '/recipes', component: () => import('@/views/Recipes.vue') },
  { path: '/recipes/:id', component: () => import('@/views/RecipesDetail.vue') },
  { path: '/tools', component: () => import('@/views/Tools.vue') },
  {path: '/front', component: () => import('@/views/front/Front.vue') },
  {path: '/front/:id', component: () => import('@/views/front/FrontDetail.vue') }
]

export default createRouter({
  history: createWebHistory(),
  routes
})