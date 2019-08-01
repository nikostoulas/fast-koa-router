import { Router } from './router';

const makeArray = args => (Array.isArray(args) ? args : [args]);
export const router = routes => {
  const router = new Router(routes);
  return async (ctx, next) => {
    const policy = router.getPolicy(ctx);
    const middleware = router.getMiddlewareAndSetState(ctx);
    const middlewares = [];
    if (policy) middlewares.push(...makeArray(policy));
    if (middleware) middlewares.push(...makeArray(middleware));
    await middlewares.reduceRight((middleware, r) => () => r(ctx, middleware), next)();
  };
};
