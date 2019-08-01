import { handlePathVariables, getPathMethod, parse, addPrefixMiddleware } from './parse';
export class Router {
  routes: { [key: string]: any };
  constructor(routes) {
    this.routes = handlePathVariables(addPrefixMiddleware(parse(routes), routes.prefix));
  }

  getMiddlewareAndSetState(ctx) {
    const { path, method } = ctx;
    const { middleware, params, _matchedRoute } = getPathMethod(this.routes, path, method.toLowerCase());
    ctx.params = params || {};
    ctx._matchedRoute = _matchedRoute;
    return middleware;
  }

  getPolicy(ctx) {
    return getPathMethod(this.routes, ctx.path, 'policy').middleware;
  }
}
