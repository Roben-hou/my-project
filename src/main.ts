import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 挂载路由实例
app.use(router)

app.mount('#app')
