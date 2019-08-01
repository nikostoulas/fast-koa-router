import { Router } from './router';

export const router = routes => {
  const router = new Router(routes);
  return async (ctx, next) => {
    const policy = router.getPolicy(ctx);
    const middleware = router.getMiddlewareAndSetState(ctx);
    const middlewares = [];
    if (policy) middlewares.push(policy);
    if (middleware) middlewares.push(...(Array.isArray(middleware) ? middleware : [middleware]));
    await middlewares.reduceRight((middleware, r) => () => r(ctx, middleware), next)();
  };
};
