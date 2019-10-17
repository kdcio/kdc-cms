/**
 * simulate API Gateway event
 */

class Request {
  constructor(handler) {
    this.handler = handler;
  }

  async exec({ path, method, data }) {
    const proxy = path && path.substr(1) !== '' ? path.substr(1) : null;
    const response = await this.handler({
      pathParameters: proxy ? { proxy } : null,
      httpMethod: method,
      body: JSON.stringify(data)
    });
    if (response.body) {
      response.body = JSON.parse(response.body);
    }
    return response;
  }

  async post(path, data) {
    return this.exec({ path, method: 'POST', data });
  }

  async get(path, data) {
    return this.exec({ path, method: 'GET', data });
  }

  async put(path, data) {
    return this.exec({ path, method: 'PUT', data });
  }

  async delete(path, data) {
    return this.exec({ path, method: 'DELETE', data });
  }
}

export default handler => {
  return new Request(handler);
};
