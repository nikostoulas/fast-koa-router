import { handlePathVariables, getPathMethod, parse } from './parse';
export class Router {
  routes: { [key: string]: any };
  constructor(routes) {
    this.routes = handlePathVariables(parse(routes));
  }

  getRouteAndSetState(ctx) {
    const  { path, method } = ctx;
    const { route, params } = getPathMethod(this.routes, path, method.toLowerCase());
    ctx.params = params || {};
    return route;
  }

  getPolicy(ctx) {
    return getPathMethod(this.routes, ctx.path, 'policy').route;
  }
}
