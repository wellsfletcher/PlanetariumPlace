import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  /*
  return {
    width,
    height
  };
  */
  return {
    windowWidth: width,
    windowHeight: height
  };
}

export default function useSwiping() {
  // const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [isSwiping, setSwiping] = useState(false);

  useEffect(() => {
    /*
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    */

    const onMouseDown=() => {
      setSwiping(false);
    };
    const onMouseMove=() => {
      setSwiping(true);
    };
    const onMouseUp=e => {
      if (!isSwiping && e.button === 0) {
        console.log('dragging');
      } else {
        console.log('not dragging');
      }

      setSwiping(false);
    };
    const onTouchStart=() => {
      setSwiping(false);
    };
    const onTouchMove=() => {
      setSwiping(true);
    };
    const onTouchEnd=e => {
      e.preventDefault();

      if (!isSwiping) {
        console.log('swiping');
      } else {
        console.log('not swiping');
      }

      setSwiping(false);
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);

    return () => {
        document.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        document.removeEventListener('touchstart', onTouchStart);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
    };

  }, []);

  return isSwiping;
}
