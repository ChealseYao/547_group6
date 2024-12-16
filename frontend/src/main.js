import { createApp } from 'vue'
import '@/styles/index.scss'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { Icon } from '@iconify/vue'
import 'virtual:svg-icons-register'
const app = createApp(App)
app.use(router)
app.use(plugins)
app.use(ElementPlus)
app.mount('#app')
