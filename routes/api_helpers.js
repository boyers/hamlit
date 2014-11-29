exports.getUserData = function(user) {
  return {
    username: user.username,
    normalizedUsername: user.normalizedUsername
  };
};
