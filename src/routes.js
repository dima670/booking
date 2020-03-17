import Room from "./views/Room";
import NotFound from "./views/NotFound";
export const routes = [
    {
        path: '/room/:room',
        component: Room
    },
    {
        path: '/404',
        name: '404',
        component: NotFound,
    }, {
        path: '*',
        redirect: '/404'
    }
];