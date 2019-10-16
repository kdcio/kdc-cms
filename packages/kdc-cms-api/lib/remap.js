export default (data, map) => {
  const { pk, sk, gs1pk, gs1sk, ...attr } = data;
  const tmp = {
    ...attr
  };

  if (pk && map.pk) {
    tmp[map.pk] = pk;
  }

  if (gs1sk && map.gs1sk) {
    tmp[map.gs1sk] = gs1sk;
  }

  return tmp;
};
