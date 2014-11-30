// The point of this file is to provide a mechanism to
// instantly stop async tasks, such as animations and
// AJAX calls. This is useful for tasks that modify
// DOM nodes on completion. If the DOM nodes referenced
// by an async task are destroyed before the task
// completes, we would get JavaScript errors when the
// completion handler attempts to reference nonexistent
// DOM nodes. To prevent that, we cancel the tasks
// when we delete relevant DOM nodes.

// Can't use an object here, because only strings can be
// used as keys of objects.
window.asyncTasks = [];

// Register an async task.
// canceler is a callback that cancels the async operation.
// It should be idempotent. To prevent memory leaks, async
// tasks are automatically killed after timeout milliseconds.
// group is any hashable value, which is used to identify
// related async tasks with each other. It can also be a function;
// in that case, the function will be called to get the group.
window.registerAsyncTask = function(timeout, group, canceler) {
  if (_.isFunction(group)) {
    group = group();
  }

  var guid = window.createGUID();

  var i = _.findIndex(window.asyncTasks, function(pair) {
    return pair[0] === group;
  });
  if (i === -1) {
    i = window.asyncTasks.push([group, { }]) - 1;
  }

  window.asyncTasks[i][1][guid] = canceler;

  setTimeout(function() {
    var j = _.findIndex(window.asyncTasks, function(pair) {
      return pair[0] === group;
    });

    if (j !== -1) {
      if (window.asyncTasks[j][1][guid]) {
        window.asyncTasks[j][1][guid]();
        delete window.asyncTasks[j][1][guid];
      }
      if (_.isEmpty(window.asyncTasks[j][1])) {
        window.asyncTasks.splice(j, 1);
      }
    }
  }, timeout + 100);
};

// Cancels all async tasks for a group. Call this when
// deleting DOM nodes that are referenced by these tasks.
window.stopAsyncTasks = function(group) {
  if (_.isFunction(group)) {
    group = group();
  }

  var i = _.findIndex(window.asyncTasks, function(pair) {
    return pair[0] === group;
  });

  if (i !== -1) {
    _.forIn(window.asyncTasks[i][1], function(canceler) {
      canceler();
    });
    window.asyncTasks.splice(i, 1);
  }
};
