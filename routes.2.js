const controllers = [];

const routes = {
  '/health': {
    get: controllers
  },
  '/api/v1/100': {
    get: controllers
  },
  '/eps/v1/accounts/:id/rewards': {
    post: controllers
  },
  '/api/v1/webhooks/events/:id/:sub/:action': {
    policy: controllers
  }
};

exports.routes = routes;
