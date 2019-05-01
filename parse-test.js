const assert = require('assert');
const routes = require('./routes').routes;
const routes1 = require('./routes.1').routes;
const routes2 = require('./routes.2').routes;
const { parse, handlePathVariables } = require('./parse');

assert.deepEqual(parse(routes), parse(routes1));
assert.deepEqual(parse(routes), parse(routes2));

assert.deepEqual(handlePathVariables(parse(routes)), {
  '/health': { get: [] },
  '/api/v1/100': { get: [] },
  '/eps/v1/accounts/:id/rewards': { post: [] },
  '/api/v1/webhooks/events/:id/:sub/:action': { policy: [] },
  '/eps': { '/v1': { '/accounts': { '/_VAR_': { paramName: 'id', '/rewards': { post: [] } } } } },
  '/api': {
    '/v1': {
      '/webhooks': {
        '/events': {
          '/_VAR_': {
            paramName: 'id',
            policy: [],
            '/_VAR_': {
              paramName: 'sub',
              policy: [],
              '/_VAR_': {
                paramName: 'action',
                policy: []
              }
            }
          }
        }
      }
    }
  }
});
