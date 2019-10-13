module.exports = value => {
  if (/\w/.test(value) && /\d/.test(value)) {
    return true;
  }

  return false;
};
