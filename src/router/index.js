import { createRouter, createWebHashHistory } from 'vue-router';
import PageRouter from './page/';
import ViewsRouter from './views/';
import AvueRouter from './avue-router';
import Store from '../store/';

const routes = [ ...ViewsRouter,...PageRouter]
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  },
})
AvueRouter.install({
  store: Store,
  router: router,
});
router.$avueRouter.formatRoutes(Store.state.user.menu, true);
export default router
