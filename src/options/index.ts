import '@/design/index.less';
import 'tailwindcss/tailwind.css';
import { remoteAppInit } from '@/utils/public.ts';
import App from '@/options/App.vue';
import router from '@/options/router/index.ts'
import { DefineComponent } from 'vue';

const vueId = 'vct-options-app';
remoteAppInit(App as DefineComponent, vueId, false, [router] as any)