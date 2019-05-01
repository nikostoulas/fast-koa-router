const controllers = [];

export const routes = {
  '/health': {
    get: controllers
  },
  '/api': {
    '/v1/100': {
      get: controllers
    }
  },
  '/foo': {
    get: controllers,
    '/bar/3': {
      get: controllers
    }
  },
  '/api/v1/accounts/:id/rewards': {
    post: controllers
  },
  '/api/v1/webhooks/events/:id/:sub/:action': {
    policy: controllers
  }
};
