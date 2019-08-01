exports['Parse should handle path variables 1'] = {
  "/path": {
    "policy": [],
    "post": [],
    "get": []
  },
  "/nested/path": {
    "policy": [],
    "get": []
  },
  "/nested/path/:id": {
    "policy": [],
    "get": []
  },
  "/nested": {
    "/path": {
      "/_VAR_": {
        "paramName": "id",
        "policy": [],
        "get": []
      }
    }
  }
}

exports['Parse should remove ending slash 1'] = {
  "/path": {
    "policy": [],
    "post": [],
    "get": []
  },
  "/nested/path": {
    "policy": [],
    "get": []
  },
  "/nested/path/:id": {
    "policy": [],
    "get": []
  },
  "": {
    "get": []
  },
  "/nested": {
    "/path": {
      "/_VAR_": {
        "paramName": "id",
        "policy": [],
        "get": []
      }
    }
  }
}
