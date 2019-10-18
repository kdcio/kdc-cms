module.exports = username => {
  const re = /^[a-z0-9]+$/i;
  return re.test(username) && username.length >= 4;
};
