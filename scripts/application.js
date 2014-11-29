$(function() {
  // Enable fastclick.
  FastClick.attach(document.body);

  // Load user data if logged in.
  if (/sessionId/.test(document.cookie)) {
    window.api('/api/get_user_data', { }, function(data) {
      window.bodyComponent.setUserData(data.user);
    }, function() {
      window.bodyComponent.setUserData(null);
    });
  } else {
    window.bodyComponent.setUserData(null);
  }
});
