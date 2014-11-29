exports.renderAPIError = function(res, err) {
  console.error(err);

  return res.json({
    error: 'Something went wrong.',
    validationErrors: { }
  });
};

exports.getUserData = function(user) {
  return {
    username: user.username,
    normalizedUsername: user.normalizedUsername
  };
};
