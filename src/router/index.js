import {createRouter, createWebHistory} from 'vue-router'
import Home from "@/views/home/home.vue";
import Layout from "@/views/layout/layout.vue";
import ChatAI from "@/views/chatAI/chatAI.vue";
import ChatMedical from "@/views/chatMedical/chatMedical.vue";
import ChatTravel from "@/views/chatTravel/chatTravel.vue";
import ChatPdf from "@/views/chatPdf/chatPdf.vue"
import Login from "@/views/login/login.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/main',
            component: Layout, // 使用布局组件
            children: [ // 嵌套路由
                {
                    path: '',
                    name: 'home',
                    component: Home
                },
                {
                    path: 'ai',
                    name: 'chatAI',
                    component: ChatAI
                },
                {
                    path: 'medical',
                    name: 'chatMedical',
                    component: ChatMedical
                },
                {
                    path: 'service',
                    name: 'chatTravel',
                    component: ChatTravel
                },
                {
                    path: 'pdf',
                    name: 'chatPdf',
                    component: ChatPdf
                }
            ]
        },
        {
            path: '/',
            redirect: '/main'
        }
    ],
})

export default router
