const methods = new Map();
methods.set('post', true);
methods.set('get', true);
methods.set('delete', true);
methods.set('patch', true);
methods.set('put', true);
methods.set('policy', true);

const isHttpMethodOrPolicy = key => methods.has(key);

export function parse(routes, path = '', method = null, parsedObj = {}) {
  if (!routes) {
    return;
  }
  if (path.endsWith('/')) {
    path = path.substr(0, path.length - 1);
  }
  if (Array.isArray(routes) || typeof routes === 'function') {
    parsedObj[method] = parsedObj[method] || {};
    parsedObj[method][path] = { middleware: Array.isArray(routes) ? [...routes] : [routes] };
    return;
  }
  Object.entries(routes)
    .reverse()
    .forEach(([key, value]) => {
      if (key === 'prefix') {
        return;
      }
      if (isHttpMethodOrPolicy(key)) {
        parse(value, path, key, parsedObj);
        return;
      }
      parse(value, path + key, method, parsedObj);
    });
  return parsedObj;
}

const pathVariableRegexp = /\/?(\:.*?)(?:\/|$)/g;
const starRegexp = /\/?(\*)(?:\/|$)/g;
export function handlePathVariables(parsedObj) {
  for (const routes of Object.values(parsedObj)) {
    for (const [key, value] of Object.entries(routes)) {
      let newKey = key.replace(pathVariableRegexp, (a, b) => a.replace(b, '_VAR_'));
      newKey = newKey.replace(starRegexp, (a, b) => a.replace(b, '_STAR_'));
      let iterator = routes;
      const parts = newKey.split('/').filter(x => x);
      const oldParts = key.split('/').filter(x => x);
      let i = 0;
      for (const path of parts) {
        iterator[`/${path}`] = iterator[`/${path}`] || {};
        if (path === '_VAR_') iterator[`/${path}`].paramName = oldParts[i].substring(1);
        iterator = iterator[`/${path}`];
        if (i === parts.length - 1) {
          Object.assign(iterator, value);
        }
        i++;
      }
    }
  }
  return parsedObj;
}

export function addPrefixMiddleware(parsedObj, prefixes = {}) {
  for (let [prefix, m] of Object.entries(prefixes).reverse()) {
    let endsWithSlash = false;
    if (prefix.endsWith('/')) {
      endsWithSlash = true;
      prefix = prefix.substr(0, prefix.length - 1);
    }
    for (const [method, routes] of Object.entries(parsedObj)) {
      if (method === 'policy') continue;
      for (const [key, value] of Object.entries(routes)) {
        const newKey = key.replace(pathVariableRegexp, (a, b) => a.replace(b, '_VAR_'));
        const newPrefix = prefix.replace(pathVariableRegexp, (a, b) => a.replace(b, '_VAR_'));
        if (newKey.indexOf(newPrefix) === 0 && value.middleware) {
          if (endsWithSlash && newKey.length !== newPrefix.length && newKey[newPrefix.length] !== '/') {
            continue;
          }
          value.middleware.unshift(...(Array.isArray(m) ? m : [m]));
        }
      }
    }
  }
  return parsedObj;
}

export function getPathMethod(routes, path: string, method) {
  if (path.endsWith('/')) {
    path = path.substr(0, path.length - 1);
  }
  const params = {};
  let _matchedRoute = '';
  routes = routes[method] || {};
  if (routes[path]) {
    return { middleware: routes[path].middleware, _matchedRoute: path };
  } else {
    const parts = path.split('/').filter(x => x);
    let iterator = routes;
    let middleware;
    let lastMiddlewareRoute;
    if (parts.length === 0 && iterator['/_STAR_']) {
      iterator = iterator['/_STAR_'];
      _matchedRoute += '/*';
    }
    for (const path of parts) {
      if (iterator['/_STAR_']) {
        lastMiddlewareRoute = _matchedRoute + '/*';
        middleware = iterator['/_STAR_'].middleware;
      }
      if (iterator[`/${path}`]) {
        _matchedRoute += `/${path}`;
        iterator = iterator[`/${path}`];
      } else if (iterator['/_VAR_']) {
        iterator = iterator['/_VAR_'];
        params[iterator.paramName] = path;
        _matchedRoute += `/:${iterator.paramName}`;
      } else if (iterator['/_STAR_'] && iterator['/_STAR_'].middleware) {
        _matchedRoute += '/*';
        return { middleware: iterator['/_STAR_'].middleware, _matchedRoute };
      } else {
        if (middleware) {
          return { middleware, _matchedRoute: lastMiddlewareRoute };
        }
        return {};
      }
    }
    if (iterator.middleware) {
      return { middleware: iterator.middleware, params, _matchedRoute };
    } else if (middleware) {
      return { middleware, _matchedRoute: lastMiddlewareRoute };
    } else {
      return {};
    }
  }
}
