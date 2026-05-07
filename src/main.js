import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { GChart } from 'vue-google-charts';
import App from './App.vue';
import router from './router/index.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './style.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.component('GChart', GChart);
app.mount('#app');
