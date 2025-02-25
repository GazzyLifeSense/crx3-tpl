import { createRouter, createWebHashHistory } from 'vue-router'
import Demo from '@/options/views/Demo.vue'
import Entry from '../views/entry/entry.vue'
import Excel2Json from '../views/excel2json/index.vue'

const routes: any[] = [
    // // URL未包含路由hash，则跳转至Home页面
    // { path: '/', redirect: '/home', exact: true },
    // 匹配 #/，指向Entry页面
    {
        path: '/',
        component: Entry,
        // 这里是Entry的二级路由配置
        children: [
            // 精确匹配 #/home，指向Home页面
            {
                path: 'home',
                component: Demo,
                exact: true,
            },
            {
                path: 'excel2json',
                component: Excel2Json,
                exact: true,
            },
            // 空hash，则跳转至Home页面
            { path: '', redirect: 'home' },
            // 未匹配，则跳转至Home页面
            { path: '/:pathMatch(.*)', redirect: 'home' },
        ],
    },
]

const router: any = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router