const actions = [];

export const routes = {
  get: {
    '/path': actions,
    '/nested': {
      '/path': actions,
      '/path/:id': actions
    }
  },
  post: {
    '/path': actions
  },
  policy: {
    '/path': actions,
    '/nested': {
      '/path': actions,
      '/path/:id': actions
    }
  }
};
