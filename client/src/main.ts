import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'sweetalert2/dist/sweetalert2.min.css';
import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';

const app = createApp(App)

app.use(router);
app.use(VueTelInput);
app.mount('#app')
