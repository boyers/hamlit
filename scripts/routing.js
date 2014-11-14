window.makeRelativeURL = function(URL) {
  var thisHost = /(http(s?):\/\/)?([^/]*)(\/|$)/i.exec(window.location.href)[3];
  var escapedHost = thisHost.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  var matches = (new RegExp('^(((https?:\\/\\/)?((' + escapedHost + ')|((www\\.)?eigenfeed\\.com))(\\/|$))|\\/)', 'i')).exec(URL);
  if (matches === null) {
    return null;
  } else {
    return '/' + URL.slice(matches[0].length);
  }
};

var onLoadRelativeURL = function(URL) {
  URL = window.makeRelativeURL(URL);
  window.bodyComponent.loadRelativeURL(URL);
};

var goToRelativeURL = function(URL) {
  URL = window.makeRelativeURL(URL);
  if (URL.toLowerCase() !== window.makeRelativeURL(window.location.href).toLowerCase()) {
    window.history.pushState(null, '', URL);
  }
  onLoadRelativeURL(URL);
};

window.goToURL = function(URL) {
  if (window.makeRelativeURL(URL) === null || !history.pushState) {
    window.location.href = URL;
  } else {
    goToRelativeURL(URL);
  }
};

window.onpopstate = function(event) {
  onLoadRelativeURL(window.location.href);
};

$(function() {
  onLoadRelativeURL(window.location.href);
});

$(document).on('click', 'a', function(event) {
  window.goToURL(this.href);
  return false;
});
