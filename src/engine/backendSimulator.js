/**
 * Controlled Backend Simulator & Mock Express Engine for CodeQuest.
 *
 * Provides a safe, isolated, in-memory backend execution environment.
 * Allows learners to write authentic Express routes, middleware, and
 * database queries without requiring Node.js child processes or real network servers.
 */

/**
 * Creates an in-memory database instance with CRUD and SQL simulation.
 */
export function createMockDb(initialData = {}) {
  const tables = {};

  // Initialize seed tables
  for (const [table, rows] of Object.entries(initialData)) {
    tables[table] = JSON.parse(JSON.stringify(rows));
  }

  const getTable = (tableName) => {
    if (!tables[tableName]) {
      tables[tableName] = [];
    }
    return tables[tableName];
  };

  return {
    getTables() {
      return JSON.parse(JSON.stringify(tables));
    },

    find(tableName, predicate) {
      const table = getTable(tableName);
      if (!predicate) return JSON.parse(JSON.stringify(table));
      const filtered = table.filter(typeof predicate === "function" ? predicate : (row) => {
        return Object.entries(predicate).every(([k, v]) => row[k] === v);
      });
      return JSON.parse(JSON.stringify(filtered));
    },

    findById(tableName, id) {
      const table = getTable(tableName);
      const found = table.find((row) => String(row.id) === String(id));
      return found ? JSON.parse(JSON.stringify(found)) : null;
    },

    insert(tableName, item) {
      const table = getTable(tableName);
      const doc = {
        id: item.id || `${tableName.slice(0, 3)}-${Date.now()}-${table.length + 1}`,
        ...item,
      };
      table.push(doc);
      return JSON.parse(JSON.stringify(doc));
    },

    update(tableName, id, updates) {
      const table = getTable(tableName);
      const index = table.findIndex((row) => String(row.id) === String(id));
      if (index === -1) return null;
      table[index] = { ...table[index], ...updates, id: table[index].id };
      return JSON.parse(JSON.stringify(table[index]));
    },

    delete(tableName, id) {
      const table = getTable(tableName);
      const index = table.findIndex((row) => String(row.id) === String(id));
      if (index === -1) return false;
      table.splice(index, 1);
      return true;
    },

    query(sql) {
      const trimmed = (sql || "").trim();
      
      // SELECT query
      if (/^SELECT/i.test(trimmed)) {
        const fromMatch = trimmed.match(/FROM\s+([a-zA-Z0-9_]+)/i);
        if (!fromMatch) return [];
        const tableName = fromMatch[1].toLowerCase();
        let rows = getTable(tableName);

        // WHERE clause
        const whereMatch = trimmed.match(/WHERE\s+([^ORDER|LIMIT]+)/i);
        if (whereMatch) {
          const whereClause = whereMatch[1].trim();
          const eqMatch = whereClause.match(/([a-zA-Z0-9_]+)\s*=\s*['"]?([^'"]+)['"]?/);
          const gtMatch = whereClause.match(/([a-zA-Z0-9_]+)\s*>\s*([0-9]+)/);
          const ltMatch = whereClause.match(/([a-zA-Z0-9_]+)\s*<\s*([0-9]+)/);
          
          if (eqMatch) {
            const [, col, val] = eqMatch;
            rows = rows.filter((r) => String(r[col]).toLowerCase() === val.toLowerCase());
          } else if (gtMatch) {
            const [, col, val] = gtMatch;
            rows = rows.filter((r) => Number(r[col]) > Number(val));
          } else if (ltMatch) {
            const [, col, val] = ltMatch;
            rows = rows.filter((r) => Number(r[col]) < Number(val));
          }
        }

        // ORDER BY
        const orderMatch = trimmed.match(/ORDER BY\s+([a-zA-Z0-9_]+)(?:\s+(ASC|DESC))?/i);
        if (orderMatch) {
          const col = orderMatch[1];
          const desc = orderMatch[2] && orderMatch[2].toUpperCase() === "DESC";
          rows = [...rows].sort((a, b) => {
            if (a[col] < b[col]) return desc ? 1 : -1;
            if (a[col] > b[col]) return desc ? -1 : 1;
            return 0;
          });
        }

        // LIMIT
        const limitMatch = trimmed.match(/LIMIT\s+([0-9]+)/i);
        if (limitMatch) {
          rows = rows.slice(0, Number(limitMatch[1]));
        }

        return JSON.parse(JSON.stringify(rows));
      }

      return [];
    },
  };
}

/**
 * Creates an Express-like mock server application.
 */
export function createMockApp(db = createMockDb()) {
  const stack = [];

  function addRoute(method, path, handlers) {
    const paramNames = [];
    const patternStr = path.replace(/:([a-zA-Z0-9_]+)/g, (_, name) => {
      paramNames.push(name);
      return "([^/]+)";
    });
    const regex = new RegExp(`^${patternStr}$`);
    handlers.forEach((h) => {
      stack.push({
        type: "route",
        method: method.toUpperCase(),
        path,
        regex,
        paramNames,
        handler: h,
      });
    });
  }

  const app = {
    db,

    use(...args) {
      if (typeof args[0] === "string") {
        const prefix = args[0];
        const handlers = args.slice(1);
        handlers.forEach((h) => stack.push({ type: "middleware", prefix, handler: h }));
      } else {
        args.forEach((h) => stack.push({ type: "middleware", prefix: "/", handler: h }));
      }
      return app;
    },

    get(path, ...handlers) {
      addRoute("GET", path, handlers);
      return app;
    },
    post(path, ...handlers) {
      addRoute("POST", path, handlers);
      return app;
    },
    put(path, ...handlers) {
      addRoute("PUT", path, handlers);
      return app;
    },
    patch(path, ...handlers) {
      addRoute("PATCH", path, handlers);
      return app;
    },
    delete(path, ...handlers) {
      addRoute("DELETE", path, handlers);
      return app;
    },

    async handleRequest(requestOptions = {}) {
      const method = (requestOptions.method || "GET").toUpperCase();
      const rawUrl = requestOptions.url || "/";
      const [urlPath, queryString] = rawUrl.split("?");

      const query = {};
      if (queryString) {
        queryString.split("&").forEach((pair) => {
          const [k, v] = pair.split("=");
          if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || "");
        });
      }

      const req = {
        method,
        url: rawUrl,
        path: urlPath,
        params: {},
        query,
        headers: requestOptions.headers || {},
        body: requestOptions.body || {},
        user: null,
      };

      let statusCode = 200;
      let headers = { "Content-Type": "application/json" };
      let responseBody = null;
      let ended = false;

      const res = {
        status(code) {
          statusCode = code;
          return res;
        },
        setHeader(k, v) {
          headers[k] = v;
          return res;
        },
        json(data) {
          responseBody = data;
          ended = true;
          return res;
        },
        send(data) {
          responseBody = data;
          ended = true;
          return res;
        },
        end() {
          ended = true;
          return res;
        },
        get statusCode() {
          return statusCode;
        },
        get body() {
          return responseBody;
        },
        get headers() {
          return headers;
        },
      };

      for (const layer of stack) {
        if (layer.type === "route" && (layer.method === method || layer.method === "ALL")) {
          const match = urlPath.match(layer.regex);
          if (match) {
            const params = {};
            layer.paramNames.forEach((name, i) => {
              params[name] = match[i + 1];
            });
            req.params = params;
            break;
          }
        }
      }

      let error = null;
      let index = 0;

      async function next(err) {
        if (ended) return;
        if (err) {
          error = err;
          while (index < stack.length) {
            const layer = stack[index++];
            if (layer.handler.length === 4) {
              try {
                await layer.handler(error, req, res, next);
                return;
              } catch (e) {
                error = e;
              }
            }
          }
          if (!ended) {
            res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
          }
          return;
        }

        while (index < stack.length) {
          const layer = stack[index++];
          if (layer.handler.length === 4) {
            continue;
          }

          if (layer.type === "middleware") {
            if (urlPath.startsWith(layer.prefix) || layer.prefix === "/") {
              try {
                await layer.handler(req, res, next);
                return;
              } catch (e) {
                await next(e);
                return;
              }
            }
          } else if (layer.type === "route") {
            if (layer.method === method || layer.method === "ALL") {
              const match = urlPath.match(layer.regex);
              if (match) {
                const params = {};
                layer.paramNames.forEach((name, i) => {
                  params[name] = match[i + 1];
                });
                req.params = params;
                try {
                  await layer.handler(req, res, next);
                  return;
                } catch (e) {
                  await next(e);
                  return;
                }
              }
            }
          }
        }

        if (!ended) {
          res.status(404).json({ success: false, error: `Route ${method} ${urlPath} not found` });
        }
      }

      await next();

      return {
        status: statusCode,
        statusCode,
        headers,
        body: responseBody,
        data: responseBody,
        ended,
      };
    },
  };

  return app;
}
