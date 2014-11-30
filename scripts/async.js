// The point of this file is to provide a mechanism to
// instantly stop async tasks, such as animations and
// AJAX calls. This is useful for tasks that modify
// DOM nodes on completion. If the DOM nodes referenced
// by an async task are destroyed before the task
// completes, we would get JavaScript errors when the
// completion handler attempts to reference nonexistent
// DOM nodes. To prevent that, we cancel the tasks
// when we delete relevant DOM nodes.

window.asyncTasks = { };

// Register an async task.
// canceler is a callback that cancels the async operation.
// It should be idempotent. To prevent memory leaks, async
// tasks are automatically killed after timeout milliseconds.
// group is any hashable value, which is used to identify
// related async tasks with each other.
window.registerAsyncTask = function(timeout, group, canceler) {
  var guid = window.createGUID();
  if (!window.asyncTasks[group]) {
    window.asyncTasks[group] = { };
  }
  window.asyncTasks[group][guid] = canceler;
  setTimeout(function() {
    if (window.asyncTasks[group]) {
      if (window.asyncTasks[group][guid]) {
        window.asyncTasks[group][guid]();
        delete window.asyncTasks[group][guid];
      }
      if (_.isEmpty(window.asyncTasks[group])) {
        delete window.asyncTasks[group];
      }
    }
  }, timeout + 100);
};

// Cancels all async tasks for a group. Call this when
// deleting DOM nodes that are referenced by these tasks.
window.stopAsyncTasks = function(group) {
  if (window.asyncTasks[group]) {
    _.forIn(window.asyncTasks[group], function(canceler) {
      canceler();
    });
    delete window.asyncTasks[group];
  }
};
