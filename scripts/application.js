$(function() {
  // enable fastclick
  FastClick.attach(document.body);

  // load user data
  if (/sessionId/.test(document.cookie)) {
    $.ajax({
      type: 'POST',
      url: '/api/get_user_data',
      data: { }
    }).done(function(data) {
      if (data.error === null) {
        window.bodyComponent.setUserData(data.user);
      } else {
        window.bodyComponent.setUserData(null);
      }
    }).fail(function() {
      window.bodyComponent.setUserData(null);
    });
  } else {
    window.bodyComponent.setUserData(null);
  }
});
