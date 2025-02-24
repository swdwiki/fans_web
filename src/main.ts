// vue router
import { createApp } from 'vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import router from '@/router/index';

// pinia
import store from '@/store';
import App from './App.vue';
import '@/assets/styles/index.scss';
import '@arco-design/web-vue/dist/arco.css';

const app = createApp(App);

app.use(router).use(store);
app.use(ArcoVueIcon);

app.mount('#app');
