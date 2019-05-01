const methods = new Map();
methods.set('post', true);
methods.set('get', true);
methods.set('delete', true);
methods.set('patch', true);
methods.set('put', true);
methods.set('policy', true);

exports.parse = function parse(routes, path = '', method, parsedObj = {}) {
  if (!routes) {
    return;
  }
  if (Array.isArray(routes) || typeof routes === 'function') {
    parsedObj[path] = { [method]: routes, ...parsedObj[path] };
    return;
  }
  Object.entries(routes).forEach(([key, value]) => {
    if (methods.has(key)) {
      parse(value, path, key, parsedObj);
      return;
    }
    parse(value, path + key, method, parsedObj);
  });
  return parsedObj;
};

const pathVariableRegexp = /\/?(\:.*?)(?:\/|$)/g;
exports.handlePathVariables = function(parsedObj) {
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
        if (path === parts[parts.length - 1]) {
          Object.assign(iterator, parsedObj[key]);
        }
        i++;
      }
    }
  }
  return parsedObj;
};
