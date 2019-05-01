const parse = require('./parse');
exports.Router = class Router {
  constructor(routes) {
    this.routes = parse.handlePathVariables(parse.parse(routes));
  }

  getRouteAndSetState(ctx) {
    const { path, method } = ctx;
    const { route, params } = parse.getPathMethod(this.routes, path, method.toLowerCase());
    ctx.params = params || {};
    return route;
  }

  getPolicy(ctx) {
    return parse.getPathMethod(this.routes, ctx.path, 'policy').route;
  }
};
