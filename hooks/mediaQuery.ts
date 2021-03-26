import { useEffect, useState } from 'react';

export enum Screen {
  Desktop,
  MobileLandscape,
  MobilePortrait,
}

export const useMediaQuery = () => {
  const [screen, setScreen] = useState(Screen.Desktop);

  useEffect(() => {
    const setScreenState = () => setScreen(screenType(window.innerHeight, window.innerWidth));
    setTimeout(setScreenState, 0);
    window.addEventListener('resize', setScreenState);
    return () => window.removeEventListener('resize', setScreenState);
  }, []);

  return screen;
};

function screenType(height: number, width: number): Screen {
  if (width < 1000 && width > height) return Screen.MobileLandscape;
  if (width < 1000 && height > width) return Screen.MobilePortrait;
  return Screen.Desktop;
}
