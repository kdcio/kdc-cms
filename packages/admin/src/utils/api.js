const api = (endpoint, { body, ...customConfig } = {}) => {
  const token = localStorage.getItem('__kdc_cms_token__');
  const headers = { 'content-type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config).then(async (r) => {
    let json = '';
    const contentType = r.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      json = await r.json();
    }
    if (r.status >= 200 && r.status <= 204) {
      return json;
    }
    return Promise.reject(json);
  });
};

export default api;
