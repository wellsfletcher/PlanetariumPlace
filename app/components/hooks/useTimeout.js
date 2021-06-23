import React, { useState, useEffect, useRef } from 'react';


export function useTimeout(callback, delay, valueArray = []) {
    /*
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
    */

    useEffect(
        () => {
            let timer1 = setTimeout(() => callback(), delay);

            // this will clear Timeout
            // when component unmount like in willComponentUnmount
            // and show will not change to true
            return () => {
                clearTimeout(timer1);
            };
        },
        // useEffect will run only one time with empty []
        // if you pass a value to array,
        // like this - [data]
        // than clearTimeout will run every time
        // this value changes (useEffect re-run)
        // []
        valueArray
    );
}

// export default useTimeout;
