import { Router } from './router';

const makeArray = args => (Array.isArray(args) ? args : [args]);

const getMatch = router =>
  function matching(path, method = 'GET') {
    const ctx = { path, method };
    const middlewares = getMiddleware(router, ctx);
    return { ctx, middlewares };
  };

export const router = routes => {
  const router = new Router(routes);
  async function fastKoaRouter(ctx, next) {
    const middlewares = getMiddleware(router, ctx);
    await middlewares.reduceRight((middleware, r) => () => r(ctx, middleware), next)();
  }
  fastKoaRouter.routes = router.routes;
  fastKoaRouter.matching = getMatch(router);
  return fastKoaRouter;
};

function getMiddleware(router: any, ctx: { path: any; method: string }) {
  const policy = router.getPolicy(ctx);
  const middleware = router.getMiddlewareAndSetState(ctx);
  const middlewares = [];
  if (policy) middlewares.push(...makeArray(policy));
  if (middleware) middlewares.push(...makeArray(middleware));
  return middlewares;
}
