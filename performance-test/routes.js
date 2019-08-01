const actions = {
  get: ctx => {
    ctx.body = { id: ctx.params.id };
  }
};

const routes = {
  '/a': {
    get: ctx => {
      ctx.body = 'OK';
    }
  },
  prefix: {
    '/': async (ctx, next) => {
      await next();
    }
  }
};
for (let route = 0; route <= 1000; route++) {
  routes[`/api/v1/${route}`] = actions;
  routes[`/api/v1/${route}/:id`] = actions;
}

module.exports = routes;
