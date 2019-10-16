const buildResponse = (statusCode, body) => {
  const response = {
    statusCode,
    isBase64Encoded: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: null
  };

  if (body) {
    response.body = JSON.stringify(body);
    response.headers['Content-Type'] = 'application/json';
  }

  return response;
};

export function success(body) {
  return buildResponse(200, body);
}

export function successPOST(body) {
  return buildResponse(201, body);
}

export function successPUT() {
  return buildResponse(204);
}

export function successDEL() {
  return buildResponse(204);
}

export function failure(statusCode, body) {
  return buildResponse(statusCode, body);
}
