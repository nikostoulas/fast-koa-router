const Koa = require('koa');
const app = new Koa();
const { router } = require('../../');
const routes = require('../routes');

app.use(router(routes));
app.listen(8070);
