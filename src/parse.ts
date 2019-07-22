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
    parsedObj[path] = { [method]: routes, ...parsedObj[path] };
    return;
  }
  Object.entries(routes).forEach(([key, value]) => {
    if (isHttpMethodOrPolicy(key)) {
      parse(value, path, key, parsedObj);
      return;
    }
    parse(value, path + key, method, parsedObj);
  });
  return parsedObj;
}

const pathVariableRegexp = /\/?(\:.*?)(?:\/|$)/g;
export function handlePathVariables(parsedObj) {
  for (const [key, value] of Object.entries(parsedObj)) {
    if (pathVariableRegexp.test(key)) {
      const newKey = key.replace(pathVariableRegexp, (a, b) => a.replace(b, '_VAR_'));
      let iterator = parsedObj;
      const parts = newKey.split('/').filter(x => x);
      const oldParts = key.split('/').filter(x => x);
      let i = 0;
      for (const path of parts) {
        iterator[`/${path}`] = { ...iterator[`/${path}`] };
        if (path === '_VAR_') iterator[`/${path}`].paramName = oldParts[i].substring(1);
        iterator = iterator[`/${path}`];
        if (i === parts.length - 1) {
          Object.assign(iterator, parsedObj[key]);
        }
        i++;
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
  if (routes[path] && routes[path][method]) {
    return { route: routes[path][method], _matchedRoute: path };
  } else {
    const parts = path.split('/').filter(x => x);
    let iterator = routes;
    for (const path of parts) {
      if (iterator[`/${path}`]) {
        _matchedRoute += `/${path}`;
        iterator = iterator[`/${path}`];
      } else if (iterator['/_VAR_']) {
        iterator = iterator['/_VAR_'];
        params[iterator.paramName] = path;
        _matchedRoute += `/:${iterator.paramName}`;
      } else {
        return {};
      }
    }
    return { route: iterator[method], params, _matchedRoute };
  }
}
