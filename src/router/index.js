import { createRouter, createWebHistory } from 'vue-router'
import ConstanciaView from '@/views/ConstanciaView.vue'

const routes = [
    { path: '/constancia/:cui', component: ConstanciaView },
]

export default createRouter({
    history: createWebHistory(),
    routes,
})