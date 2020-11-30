const methods = new Map();
methods.set('post', true);
methods.set('get', true);
methods.set('delete', true);
methods.set('patch', true);
methods.set('put', true);
methods.set('policy', true);

const isHttpMethodOrPolicy = key => methods.has(key);
const makeArray = args => (Array.isArray(args) ? args : [args]);

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
        if (path === '_VAR_') {
          if (iterator[`/${path}`].paramName && iterator[`/${path}`].paramName !== oldParts[i].substring(1)) {
            iterator[`/${path}`].paramName = [...makeArray(iterator[`/${path}`].paramName), oldParts[i].substring(1)];
          } else {
            iterator[`/${path}`].paramName = oldParts[i].substring(1);
          }
        }
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
  routes = routes[method] || {};
  if (routes[path] && routes[path].middleware) {
    return { middleware: routes[path].middleware, _matchedRoute: path };
  } else {
    const parts = path.split('/').filter(x => x);
    if (parts.length === 0 && routes['/_STAR_']) {
      return {
        middleware: routes['/_STAR_'].middleware,
        params: {},
        _matchedRoute: '/*'
      };
    }
    return getPathMethodRecursively(routes, parts) || {};
  }
}

function getPathMethodRecursively(routes, remainingPaths) {
  let [currentPath, ...rest] = remainingPaths;
  if (!currentPath && routes.middleware) return { _matchedRoute: '', params: {}, middleware: routes.middleware };

  if (routes[`/${currentPath}`]) {
    const remaining = getPathMethodRecursively(routes[`/${currentPath}`], rest);
    if (remaining) {
      return {
        _matchedRoute: `/${currentPath}${remaining._matchedRoute}`,
        params: remaining.params,
        middleware: remaining.middleware
      };
    }
  }

  if (routes['/_VAR_']) {
    const remaining = getPathMethodRecursively(routes[`/_VAR_`], rest);
    const params = {};
    if (Array.isArray(routes['/_VAR_'].paramName)) {
      routes['/_VAR_'].paramName.forEach(key => (params[key] = currentPath));
    } else {
      params[routes['/_VAR_'].paramName] = currentPath;
    }
    if (remaining) {
      return {
        _matchedRoute: `/:${routes['/_VAR_'].paramName}${remaining._matchedRoute}`,
        params: { ...params, ...remaining.params },
        middleware: remaining.middleware
      };
    }
  }

  if (routes['/_STAR_'] && routes['/_STAR_'].middleware) {
    return { middleware: routes['/_STAR_'].middleware, params: {}, _matchedRoute: '/*' };
  }

  return false;
}
