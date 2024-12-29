function authorizeUser(req) {
  const userId = req?.user?.id;
  return userId || null;
}

module.exports = authorizeUser;
