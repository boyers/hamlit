window.debounce = function(asyncGroup, callback, delay) {
  if (typeof delay === 'undefined') {
    delay = 300;
  }
  var timeout = null;
  return function() {
    var args = Array.prototype.slice.call(arguments);
    if (timeout !== null) {
      clearInterval(timeout);
    }
    timeout = setTimeout((function() {
      callback.apply(this, args);
      timeout = null;
    }), delay);
    var timeoutCapture = timeout;
    window.registerAsyncTask(delay, asyncGroup, function() {
      clearInterval(timeoutCapture);
    });
  };
};
