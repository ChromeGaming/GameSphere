(function () {
  "use strict";

  window.EventListenersManager = function (events) {
    var listeners = {};

    function init() {
      var i, event;

      for (i in events) {
        if (!events.hasOwnProperty(i)) {
          continue;
        }
        event = events[i];

        listeners[event] = [];
      }
    }

    init();

    this.trigger = function (event, data) {
      if (listeners[event] === undefined) {
        throw 'Unknown event "' + event + '"';
      }

      for (var i = 0, l = listeners[event].length; i < l; i++) {
        listeners[event][i](data);
      }
    };

    this.addEventListener = function (event, callback) {
      if (listeners[event] === undefined) {
        throw 'Unknown event "' + event + '"';
      }

      if (typeof callback !== "function") {
        throw 'Second argument must be a function.';
      }

      listeners[event].push(callback);
    };

    this.removeEventListener = function (event, callback) {
      if (event && listeners[event] === undefined) {
        throw 'Unknown event "' + event + '"';
      } else if (!event) {
        listeners = [];
        return;
      }

      if (!callback) {
        listeners[event] = [];
      } else {
        for (var i in listeners[event]) {
          if (!listeners[event].hasOwnProperty(i)) {
            continue;
          }

          if (listeners[event][i] === callback) {
            listeners[event].splice(i, 1);
            break;
          }
        }
      }
    };
  }
})();