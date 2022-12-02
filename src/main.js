import {createApp} from 'vue'
import store from './store'
import router from './router'
import './index.css';
// import './assets/day.min.js'
// import './assets/timezone.js'
// import './assets/dayjs/day.js'
// import './assets/dayjs/plugin/timezone.js'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import App from './App.vue'

const app = createApp(App);

dayjs.extend(window.dayjs_plugin_timezone)
dayjs.tz.setDefault("America/Caracas")

app
  .use(store)
  .use(router)
  .mount('#app')
;

app 
  .component('Datepicker', Datepicker)

app.config.globalProperties.$dayjs = (params) => {  
  return dayjs(params)
}

