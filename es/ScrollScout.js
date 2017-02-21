import raf from 'raf';
import throttle from 'raf-throttle';

// polyfill requestAnimationFrame when needed
if (!window.requestAnimationFrame) {
    raf.polyfill();
}

export var ScrollScout = new function () {

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