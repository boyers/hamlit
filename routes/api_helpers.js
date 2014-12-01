exports.getUserData = function(user) {
  return {
    username: user.username,
    normalizedUsername: user.normalizedUsername
  };
};

exports.internalError = function(res, err) {
  console.error(err);
  return res.json({
    error: 'Oops, something went wrong.'
  });
};
