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
  }
};
for (let route = 0; route <= 50; route++) {
  routes[`/api/v1/${route}`] = actions;
  routes[`/api/v1/${route}/:id`] = actions;
}

module.exports = routes;
