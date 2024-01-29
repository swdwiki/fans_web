// i18n
import { createI18n } from 'vue-i18n';
import messages from '@intlify/vite-plugin-vue-i18n/messages';
// vue router
import { createApp } from 'vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import router from '@/router/index';

// pinia
import store from '@/store';
import App from './App.vue';

// import 'virtual:windi.css';
// Devtools: https://windicss.org/integrations/vite.html#design-in-devtools
import 'virtual:windi-devtools';
import '@/assets/styles/index.scss';
import '@/assets/styles/style.css';
import '@/assets/styles/default.scss';
import '@arco-design/web-vue/dist/arco.css';
// import '@vavt/markdown-theme/all.css';

const i18n = createI18n({
  locale: 'en',
  messages,
});

const app = createApp(App);

app.use(router).use(store);
app.use(ArcoVueIcon);

app.use(i18n);

app.mount('#app');
