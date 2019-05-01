const { Router } = require('./router');

module.exports = routes => {
  const router = new Router(routes);
  return async (ctx, next) => {
    const policy = router.getPolicy(ctx);
    const route = router.getRouteAndSetState(ctx);
    if (policy) await policy(ctx, next);
    if (route) {
      if (Array.isArray(route)) {
        return route.reduceRight((middleware, r) => r(ctx, middleware), next);
      } else {
        await route(ctx, next);
      }
    }
  };
};
