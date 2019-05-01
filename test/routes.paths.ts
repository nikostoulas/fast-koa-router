const actions = [];

export const routes = {
  '/path': {
    get: actions,
    post: actions,
    policy: actions
  },
  '/nested': {
    '/path': { get: actions, policy: actions },
    '/path/:id': { get: actions, policy: actions }
  }
};
