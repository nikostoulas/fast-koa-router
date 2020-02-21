const Koa = require('koa');
const app = new Koa();
const { router } = require('../../');
const routes = require('../routes');

const date = +new Date();
app.use(router(routes));
app.listen(8080, () => console.log('started', -date + +new Date()));
