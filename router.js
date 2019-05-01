const parse = require('./parse');
exports.Router = class Router {
  constructor(routes) {
    this.routes = parse.handlePathVariables(parse.parse(routes));
  }

  getRouteAndSetState(ctx) {
    const { path, method } = ctx;
    const { route, params } = this.getPathMethod(path, method.toLowerCase());
    ctx.params = params || {};
    return route;
  }

  getPolicy(ctx) {
    return this.getPathMethod(ctx.path, 'policy').route;
  }

  getPathMethod(path, method) {
    const params = {};
    if (this.routes[path] && this.routes[path][method]) {
      return { route: this.routes[path][method] };
    } else {
      const parts = path.split('/').filter(x => x);
      let iterator = this.routes;
      for (const path of parts) {
        if (iterator[`/${path}`]) {
          iterator = iterator[`/${path}`];
        } else if (iterator['/_VAR_']) {
          iterator = iterator['/_VAR_'];
          params[iterator.paramName] = path;
        } else {
          return {};
        }
      }
      return { route: iterator[method], params };
    }
  }
};
