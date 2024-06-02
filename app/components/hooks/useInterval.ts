import React, {useState, useEffect, useRef, MutableRefObject} from 'react';


export function useInterval(callback: () => void, delay: number) {
  //- const savedCallback = useRef();
  // changed bc of TS error
  const savedCallback = useRef<() => void>(callback);
  // const savedCallback: MutableRefObject<> = useRef();
  // const globeEl: MutableRefObject<GlobeMethods> = React.useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// export default useInterval;
