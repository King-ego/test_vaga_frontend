import { createApp } from 'vue';
import './colors.css';
import './fonts.css';
import './style.css';
import App from './App.vue';
import Routers from "./routers";

createApp(App).use(Routers).mount('#app')
