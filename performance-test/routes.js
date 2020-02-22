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

// This is a way to create many routes for performance testing.
for (let route = 0; route <= 10000; route++) {
  routes[`/api/v1/${route}`] = actions;
  routes[`/api/v1/${route}/:id`] = actions;
}

// for @koa/route order of routes matters.
routes['/*'] = {
  get: ctx => {
    ctx.body = 'Nothing here';
  }
};

module.exports = routes;
