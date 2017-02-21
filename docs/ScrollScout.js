(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ScrollScout = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var performanceNow = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.7.1
(function () {
  var getNanoSeconds, hrtime, loadTime;

  if (typeof performance !== "undefined" && performance !== null && performance.now) {
    module.exports = function () {
      return performance.now();
    };
  } else if (typeof process !== "undefined" && process !== null && process.hrtime) {
    module.exports = function () {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function getNanoSeconds() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function () {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function () {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }
}).call(commonjsGlobal);
});

var now = performanceNow;
var root = typeof window === 'undefined' ? commonjsGlobal : window;
var vendors = ['moz', 'webkit'];
var suffix = 'AnimationFrame';
var raf = root['request' + suffix];
var caf = root['cancel' + suffix] || root['cancelRequest' + suffix];

for (var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix];
  caf = root[vendors[i] + 'Cancel' + suffix] || root[vendors[i] + 'CancelRequest' + suffix];
}

// Some versions of FF have rAF but not cAF
if (!raf || !caf) {
  var last = 0,
      id = 0,
      queue = [],
      frameDuration = 1000 / 60;

  raf = function raf(callback) {
    if (queue.length === 0) {
      var _now = now(),
          next = Math.max(0, frameDuration - (_now - last));
      last = next + _now;
      setTimeout(function () {
        var cp = queue.slice(0);
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0;
        for (var i = 0; i < cp.length; i++) {
          if (!cp[i].cancelled) {
            try {
              cp[i].callback(last);
            } catch (e) {
              setTimeout(function () {
                throw e;
              }, 0);
            }
          }
        }
      }, Math.round(next));
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    });
    return id;
  };

  caf = function caf(handle) {
    for (var i = 0; i < queue.length; i++) {
      if (queue[i].handle === handle) {
        queue[i].cancelled = true;
      }
    }
  };
}

var index = function (fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn);
};
var cancel = function () {
  caf.apply(root, arguments);
};
var polyfill = function () {
  root.requestAnimationFrame = raf;
  root.cancelAnimationFrame = caf;
};

index.cancel = cancel;
index.polyfill = polyfill;

var index$1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _raf = index;

var _raf2 = _interopRequireDefault(_raf);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

var rafThrottle = function rafThrottle(callback) {
  var requestId = void 0;

  var later = function later(args) {
    return function () {
      requestId = null;
      callback.apply(undefined, _toConsumableArray(args));
    };
  };

  var throttled = function throttled() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (requestId == null) {
      requestId = (0, _raf2.default)(later(args));
    }
  };

  throttled.cancel = function () {
    return _raf2.default.cancel(requestId);
  };

  return throttled;
};

exports.default = rafThrottle;
});

var throttle = unwrapExports(index$1);

// polyfill requestAnimationFrame when needed
if (!window.requestAnimationFrame) {
    index.polyfill();
}

var ScrollScout$1 = new function () {

    var windowHeight = void 0,
        windowScrollY = void 0;

    var watchList = {};
    var watchListKey = 0;

    var events = ['scroll', 'resize'],
        eventHandler = throttle(checkElements);
    var eventCallback = function eventCallback() {};
    var isScouting = false;

    return {
        becomesVisible: becomesVisible,
        isVisible: isInViewport,
        setOnEvent: setOnEvent
    };

    function setOnEvent(callback) {
        eventCallback = callback;
    }

    function updateWindowParams() {
        windowHeight = window.innerHeight;
        windowScrollY = window.scrollY || window.pageYOffset;
    }

    function isInViewport(element) {
        var threshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;


        if (!isVisible(element)) {
            return false;
        }

        var viewTop = windowScrollY;
        var viewBot = viewTop + windowHeight;

        var elementTop = getOffset(element);
        var elementBot = elementTop + element.offsetHeight;

        var offset = threshold / 100 * windowHeight;

        return elementBot >= viewTop - offset && elementTop <= viewBot + offset;
    }

    function becomesVisible(el) {
        var threshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;

        return new Promise(function (resolve) {
            updateWindowParams();
            if (isInViewport(el, threshold)) {
                resolve(el);
            } else {
                addToWatchlist({
                    element: el,
                    threshold: threshold,
                    resolve: resolve
                });
                scout(true);
            }
        });
    }

    function addToWatchlist(obj) {
        watchListKey++;
        watchList[watchListKey] = obj;
    }

    function scout(on) {
        var action = void 0;
        if (on) {
            action = isScouting ? false : 'addEventListener';
            isScouting = true;
        } else {
            action = 'removeEventListener';
            isScouting = false;
        }
        if (action) {
            events.forEach(function (event) {
                return window[action](event, eventHandler);
            });
        }
    }

    function getOffset(element) {
        return element.getBoundingClientRect().top + windowScrollY;
    }

    function checkElements() {
        eventCallback();
        updateWindowParams();

        Object.keys(watchList).forEach(function (key) {
            if (isInViewport(watchList[key].element, watchList[key].threshold)) {
                watchList[key].resolve(watchList[key].element);
                delete watchList[key];
            }
        });

        if (Object.keys(watchList).length === 0) {
            scout(false);
        }
    }

    function isVisible(someElement) {
        // see https://davidwalsh.name/offsetheight-visibility
        return someElement.offsetHeight > 0;
    }
}();

return ScrollScout$1;

})));
