import { createApp } from 'vue'
import App from './App.vue'

// import QEWD from the qewd-client
import { QEWD } from 'qewd-client'

// create the Vue App instance
const app = createApp(App)
// add QEWD as a global property
// now you can use QEWD in all your app components as `this.$qewd.reply(...)`
app.config.globalProperties.$qewd = QEWD
// mount the Vue.js app as usual
app.mount('#app')
