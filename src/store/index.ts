import { createPinia } from 'pinia';
import useUserStore from './user/user';
import useAuthStore from './user/auth';

const store = createPinia();

export default store;

export { useUserStore, useAuthStore };
