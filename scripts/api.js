window.api = function(endpoint, data, success, error) {
  $.ajax({
    type: 'POST',
    url: endpoint,
    data: data
  }).done(function(data) {
    if (data.redirect) {
      window.goToURL(data.redirect);
    } else {
      if (data.error) {
        if (error) {
          error(data);
        }
      } else {
        if (success) {
          success(data);
        }
      }
    }
  }).fail(function() {
    if (error) {
      error(null);
    }
  });
};
