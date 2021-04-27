import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Geo from './components/GeoComponent'
import Todo from './components/TodoComponent'

const router = new VueRouter({
    // mode: 'history',
    routes: [
        {
            path: '/geo',
            name: 'geo',
            component: Geo
        },
        {
            path: '/todolist',
            name: 'todo',
            component: Todo,
        },
    ],
});

export default router;
