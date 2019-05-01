const controllers = [];

const routes = {
  get: {
    '/health': controllers,
    '/api/v1/100': controllers,
    '/foo/bar/3': controllers,
    '/foo': controllers
  },
  post: {
    '/eps/v1/': { 'accounts/:id/rewards': controllers }
  },
  policy: {
    '/api/v1/webhooks/events/:id/:sub/:action': controllers
  }
};

exports.routes = routes;
