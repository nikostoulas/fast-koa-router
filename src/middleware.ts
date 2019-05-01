import { Router } from './router';

module.exports = routes => {
  const router = new Router(routes);
  return async (ctx, next) => {
    const policy = router.getPolicy(ctx);
    const route = router.getRouteAndSetState(ctx);
    const middlewares = [];
    if (policy) middlewares.push(policy);
    if (route) middlewares.push(...(Array.isArray(route) ? route : [route]));
    await middlewares.reduceRight((middleware, r) => r(ctx, middleware), next);
  };
};
