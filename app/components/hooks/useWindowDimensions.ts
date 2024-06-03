import { useState, useEffect } from 'react';

interface WindowDimensions {
  windowWidth: number,
  windowHeight: number,
  isLandscape: boolean,
  isPortrait: boolean
}

function getWindowDimensions(): WindowDimensions {
  const { innerWidth: width, innerHeight: height } = window;
  /*
  return {
    width,
    height
  };
  */
  return {
    windowWidth: width,
    windowHeight: height,
    isLandscape: width >= height,
    isPortrait: height > width
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // TODO: investigate if this value should change when you resize the window (probably not honestly)

  return windowDimensions;
}
