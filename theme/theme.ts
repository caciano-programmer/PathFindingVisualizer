import React from 'react';

const darkMain = '#1976d2';
const lightMain = '#083a8c';

export type Theme = {
  isDark: boolean;
  main: typeof darkMain | typeof lightMain;
  mainHover: string;
  background: string;
  secondary: string;
  path: string;
  searched: string;
  grid: string;
  smallWeight: string;
  largeWeight: string;
  select: { background: string; highlight: string; disabled: string; disabledText: string };
  visualize: { color: string };
  glow: string;
  mazeGlow: string;
  options: string;
  code: { separators: string; functions: string; keywords: string; comments: string; others: string };
  scrollbar: { thumb: string; track: string };
  animation: { startColor: string; midColor: string; finalColor: string };
};

export const Light: Theme = {
  isDark: false,
  main: lightMain,
  mainHover: 'rgba(8, 58, 140, .5)',
  background: '#eeeeee',
  secondary: '#410093',
  path: 'rgba(65, 0, 147, .6)',
  searched: 'rgba(65, 0, 147, .2)',
  grid: '#aaaaaa',
  smallWeight: '#5400c4',
  largeWeight: '#36007a',
  select: { background: '#e6e6e6', highlight: '#f2f2f2', disabled: '#bababa', disabledText: 'rgba(0,0,0,.1)' },
  visualize: { color: 'rgba(8, 58, 140, .175)' },
  glow: 'rgba(8, 58, 140, .25)',
  mazeGlow: 'rgba(8, 58, 140, .5)',
  options: 'rgba(224, 224, 224, .975)',
  code: { keywords: lightMain, comments: '#cccccc', separators: '#6330bc', functions: '#8191f0', others: '#282828' },
  scrollbar: { thumb: lightMain, track: 'rgba(8, 58, 140, .2)' },
  animation: { startColor: lightMain, midColor: '#410093', finalColor: 'rgba(65, 0, 147, .2)' },
};

export const Dark: Theme = {
  isDark: true,
  main: darkMain,
  mainHover: 'rgba(25, 118, 210, .5)',
  background: '#212121',
  secondary: '#5a0fbb',
  path: '#670edb',
  searched: '#9f98ed',
  grid: '#171717',
  smallWeight: '#002571',
  largeWeight: '#410093',
  select: { background: '#333333', highlight: '#3d3d3d', disabled: '#262626', disabledText: 'rgba(255,255,255,.25)' },
  visualize: { color: 'rgba(25, 118, 210, .1)' },
  glow: 'rgba(25, 118, 210, .25)',
  mazeGlow: darkMain,
  options: 'rgba(33, 33, 33, .9)',
  code: { keywords: darkMain, comments: '#3d3d3d', separators: '#5e5e5e', functions: '#9bd5ff', others: 'white' },
  scrollbar: { thumb: '#004ba0', track: 'rgba(0, 75, 160, .2)' },
  animation: { startColor: '#002571', midColor: '#410093', finalColor: '#9f98ed' },
};

export const MyTheme = React.createContext(Light);
