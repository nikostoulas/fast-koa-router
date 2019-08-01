exports['Parse should handle path variables 1'] = {
  "get": {
    "/nested/path/:id": {
      "middleware": []
    },
    "/nested/path": {
      "middleware": []
    },
    "/path": {
      "middleware": []
    },
    "/nested": {
      "/path": {
        "/_VAR_": {
          "paramName": "id",
          "middleware": []
        },
        "middleware": []
      }
    }
  },
  "post": {
    "/path": {
      "middleware": []
    }
  },
  "policy": {
    "/nested/path/:id": {
      "middleware": []
    },
    "/nested/path": {
      "middleware": []
    },
    "/path": {
      "middleware": []
    },
    "/nested": {
      "/path": {
        "/_VAR_": {
          "paramName": "id",
          "middleware": []
        },
        "middleware": []
      }
    }
  }
}

exports['Parse should remove ending slash 1'] = {
  "get": {
    "": {
      "middleware": []
    },
    "/nested/path/:id": {
      "middleware": []
    },
    "/nested/path": {
      "middleware": []
    },
    "/path": {
      "middleware": []
    },
    "/nested": {
      "/path": {
        "/_VAR_": {
          "paramName": "id",
          "middleware": []
        },
        "middleware": []
      }
    }
  },
  "post": {
    "/path": {
      "middleware": []
    }
  },
  "policy": {
    "/nested/path/:id": {
      "middleware": []
    },
    "/nested/path": {
      "middleware": []
    },
    "/path": {
      "middleware": []
    },
    "/nested": {
      "/path": {
        "/_VAR_": {
          "paramName": "id",
          "middleware": []
        },
        "middleware": []
      }
    }
  }
}
