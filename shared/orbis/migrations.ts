
const schemas = {
  "users": {
    "name": "dev_users",
    "version": "2.0",
    "interface": false,
    "immutableFields": [],
    "implements": [],
    "accountRelation": {
      "type": "list"
    },
    "schema": {
      "type": "object",
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "image": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "username": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
        "privy_id": {
          "type": "string"
        },
        "verified": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    }
  },
  "subscriptions": {
    "name": "dev_subscriptions",
    "version": "2.0",
    "interface": false,
    "immutableFields": [],
    "implements": [],
    "accountRelation": {
      "type": "list"
    },
    "schema": {
      "type": "object",
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "author_did": {
          "type": "string"
        },
        "reader_did": {
          "type": "string"
        },
        "subscribed": {
          "type": "boolean"
        },
        "post_notifications": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    }
  },
  "notifications": {
    "name": "dev_notifications",
    "version": "2.0",
    "interface": false,
    "immutableFields": [],
    "implements": [],
    "accountRelation": {
      "type": "list"
    },
    "schema": {
      "type": "object",
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "reader_did": {
          "type": "string"
        },
        "posts": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "stream_id": {
                "type": "string"
              },
              "author_username": {
                "type": "string"
              },
              "author_did": {
                "type": "string"
              },
              "title": {
                "type": "string"
              },
              "preview": {
                "type": "string"
              }
            },
            "additionalProperties": false
          }
        },
        "comments": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "stream_id": {
                "type": "string"
              },
              "author_username": {
                "type": "string"
              },
              "author_did": {
                "type": "string"
              },
              "preview": {
                "type": "string"
              }
            },
            "additionalProperties": false
          }
        },
        "status": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "tags": {
    "name": "dev_tags",
    "version": "2.0",
    "interface": false,
    "immutableFields": [],
    "implements": [],
    "accountRelation": {
      "type": "list"
    },
    "schema": {
      "type": "object",
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "categories": {
    "name": "dev_categories",
    "version": "2.0",
    "interface": false,
    "immutableFields": [],
    "implements": [],
    "accountRelation": {
      "type": "list"
    },
    "schema": {
      "type": "object",
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "categorySuggestions": {
    "name": "dev_category_suggestions",
    "version": "2.0",
    "interface": false,
    "immutableFields": [],
    "implements": [],
    "accountRelation": {
      "type": "list"
    },
    "schema": {
      "type": "object",
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "status": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "posts": {
    "name": "dev_posts",
    "version": "2.0",
    "interface": false,
    "immutableFields": [],
    "implements": [],
    "accountRelation": {
      "type": "list"
    },
    "schema": {
      "type": "object",
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "slug": {
          "type": "string"
        },
        "author_username": {
          "type": "string"
        },
        "preview": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "body": {
          "type": "string"
        },
        "category": {
          "type": "string"
        },
        "tag_ids": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "status": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "comments": {
    "name": "dev_comments",
    "version": "2.0",
    "interface": false,
    "immutableFields": [],
    "implements": [],
    "accountRelation": {
      "type": "list"
    },
    "schema": {
      "type": "object",
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "author_username": {
          "type": "string"
        },
        "body": {
          "type": "string"
        },
        "preview": {
          "type": "string"
        },
        "post_id": {
          "type": "string"
        },
        "parent_ids": {
          "type": "string"
        },
        "status": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "reactions": {
    "name": "dev_reactions",
    "version": "2.0",
    "interface": false,
    "immutableFields": [],
    "implements": [],
    "accountRelation": {
      "type": "list"
    },
    "schema": {
      "type": "object",
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "user_id": {
          "type": "string"
        },
        "content_id": {
          "type": "string"
        },
        "model": {
          "type": "string"
        },
        "type": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  }
};

const migrations = { schemas } as const;

export default migrations;
