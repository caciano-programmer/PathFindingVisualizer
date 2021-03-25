import { useEffect, useState } from 'react';

export const useMediaQuery = () => {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const isMobile = (): void => setMobile(window.innerWidth < 1000);
    setTimeout(() => setMobile(window.innerWidth < 1000), 0);
    window.addEventListener('resize', isMobile);
  }, []);

  return mobile;
};
