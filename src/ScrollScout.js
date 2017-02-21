import raf      from 'raf';
import throttle from 'raf-throttle';

// polyfill requestAnimationFrame when needed
if( !window.requestAnimationFrame ) {
    raf.polyfill();
}

export const ScrollScout = new ( () => {
    
    let windowHeight, windowScrollY;
    
    const watchList = {};
    let watchListKey = 0;
    
    const events = [ 'scroll', 'resize' ], eventHandler = throttle( checkElements );
    let eventCallback = function() {};
    let isScouting = false;
    
    return {
        becomesVisible : becomesVisible,
        isVisible      : isInViewport,
        setOnEvent     : setOnEvent
    };
    
    function setOnEvent( callback ) {
        eventCallback = callback;
    }
    
    function updateWindowParams() {
        windowHeight  = window.innerHeight;
        windowScrollY = window.scrollY || window.pageYOffset;
    }
    
    function isInViewport( element, threshold = 50 ) {
        
        if( !isVisible( element ) ) {
            return false;
        }
        
        const viewTop = windowScrollY;
        const viewBot = viewTop + windowHeight;
        
        const elementTop = getOffset( element );
        const elementBot = elementTop + element.offsetHeight;
        
        const offset = ( threshold / 100 ) * windowHeight;
        
        return ( elementBot >= viewTop - offset ) && ( elementTop <= viewBot + offset );
    }
        
    function becomesVisible( el, threshold = 50 ) {
        return new Promise( resolve => {
            updateWindowParams();
            if ( isInViewport( el, threshold ) ) {
                resolve( el );
            } else {
                addToWatchlist({
                    element   : el,
                    threshold : threshold,
                    resolve   : resolve
                });
                scout( true );
            }
        } );
    }
    
    function addToWatchlist( obj ) {
        watchListKey++;
        watchList[ watchListKey ] = obj;
    }
    
    function scout( on ) {
        let action;
        if( on ) {
            action = isScouting ? false : 'addEventListener';
            isScouting = true;
        } else {
            action = 'removeEventListener';
            isScouting = false;
        }
        if( action ) {
            events.forEach( event => window[ action ]( event, eventHandler ) );
        }
    }
    
    function getOffset( element ) {
        return element.getBoundingClientRect().top + windowScrollY;
    }
    
    function checkElements() {
        eventCallback();
        updateWindowParams();
        
        Object.keys( watchList ).forEach( key => {
            if ( isInViewport( watchList[ key ].element, watchList[ key ].threshold ) ) {
                watchList[ key ].resolve( watchList[ key ].element );
                delete watchList[ key ];
            }
        } );
        
        if ( Object.keys( watchList ).length === 0 ) {
            scout( false );
        }
    }
    
    function isVisible( someElement ) {
        // see https://davidwalsh.name/offsetheight-visibility
        return someElement.offsetHeight > 0;
    }
});