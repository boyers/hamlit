window.api = function(endpoint, asyncGroup, data, success, error) {
  var cancelled = false;
  var xhr = $.ajax({
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
    if (error && !cancelled) {
      error(null);
    }
  });
  window.registerAsyncTask(60000, asyncGroup, function() {
    cancelled = true;
    xhr.abort();
  });
};
