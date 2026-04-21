import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './styles/reset.scss'
import './styles/theme.scss'
import './styles/global.scss'

createApp(App)
  .use(router)
  .use(createPinia())
  .mount('#app')