import { css, keyframes } from '@emotion/react';

const animation = keyframes({
  '0%, 15%, 37.5%, 60%, 75%, 100%': { transform: 'translateY(0)' },
  '30%': { transform: 'translateY(-16px)' },
  '45%': { transform: 'translateY(-8px)' },
});

export const bounceAnimation = (bounce: boolean) => css({ animation: bounce ? `${animation} 1.75s infinite` : '' });
