const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const routes = require('../routes');

const router = new Router();
Object.entries(routes).forEach(([path, handler]) => {
  if (path === 'prefix') return;
  router.get(path, handler.get);
});

app.use(router.routes());
app.listen(8080);
