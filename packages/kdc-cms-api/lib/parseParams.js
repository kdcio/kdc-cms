export default (path, segments) => {
  if (!path) return null;

  const { proxy } = path;
  if (!proxy) return null;

  const params = {};
  proxy.split('/').forEach((v, k) => {
    if (segments[k]) params[segments[k]] = v;
  });

  return params;
};
