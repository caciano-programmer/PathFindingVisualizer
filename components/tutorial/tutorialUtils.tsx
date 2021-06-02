import { css } from '@emotion/react';
import React from 'react';
import { DESKTOP, MOBILE } from '../../config/config';

const welcome = `Welcome to Path Visualizer, an app to visualize and interact with some of the most 
common path finding algorithms out there. This quick tutorial will help get you up to speed on how the app works. 
To continue click the start button below.`;

const algorithms = `There a five algorithms supported: Dijkstra's, A*, Bellman-Ford, Breadth First Search, 
and Depth First Search. The first three support finding the shortest path in weighted graphs. All of the algorithms gaurantee
shortest path except for Depth First Search.`;

const weights = `If an algorithm supports weighted graphs the option to add weights will be available otherwise the weights will
be greyed out. There are two weight sizes, the smaller of the two is equivalent to 4 extra spaces or squares. The larger of the 
two weights is equivalent to 12 extra spaces. To add a weight onto the board simply drag the weight to your desired square.
Note the desired square must be currently clear or else adding a weight will fail.`;

const weightsMobile = `If an algorithm supports weighted graphs the option to add weights will be available otherwise the weights 
will be greyed out. A weight is equavalent to 12 extra spaces or squares. To add a weight onto the board simply drag/swipe the 
weight to your desired square. Note the desired square must be currently clear or else adding a weight will fail.`;

const endPoints = `These icons can also be moved just like weights. Also like weights, the desired space must be 
clear for the move to be successful.`;

const walls = `There are three ways to build walls. The first way is by simply clicking on a square. A more effecient method for
building walls is to press and hold the shift button or the ctrl button on your keyboard while moving your mouse over the board. 
Lastly, you can also press the generate maze button to generate a randomized maze of walls.  Clearing walls can be done by the same 
method used to create them or by pressing the clear icon in the top right which clears the entire board.`;

const wallsMobile = `To build a wall simply click on a square that is currently clear. Clearing walls works in the same manner, 
to clear all walls click on the clear icon in the bottom right. You can also generate a randomized maze of walls by clicking the 
maze option found in this apps settings.`;

type GifType = 'wall' | 'weight' | 'startPoint';
const Urls = (dark: boolean, type: GifType): string[] => {
  if (type === 'wall')
    return [`/video/wall-${dark ? 'dark' : 'light'}.webm`, `/video/shift-${dark ? 'dark' : 'light'}.webm`];
  if (type === 'weight')
    return [`/video/weights-${dark ? 'dark' : 'light'}.webm`, `/video/weight-move-${dark ? 'dark' : 'light'}.webm`];
  return [`/video/move-start-${dark ? 'dark' : 'light'}.webm`, `/video/move-end-${dark ? 'dark' : 'light'}.webm`];
};
const MobuleUrl = (dark: boolean, type: GifType): string => {
  if (type === 'startPoint') return `/video/mobile-points-${dark ? 'dark' : 'light'}.webm`;
  if (type === 'weight') return `/video/mobile-weight-${dark ? 'dark' : 'light'}.webm`;
  return `/video/wall-${dark ? 'dark' : 'light'}.webm`;
};

const desktop = css({ [MOBILE]: { display: 'none' } });
const mobile = css({ [DESKTOP]: { display: 'none' } });
const padding = css({ padding: '5%' });
const gifContainer = css({ flex: 1, display: 'flex', flexDirection: 'column', paddingRight: '1vw' });
const gif = css({ flex: 1, display: 'flex', alignItems: 'center' });
const video = css({ width: '100%' });

export const Gif = ({ dark, type }: { dark: boolean; type: GifType }) => {
  const url = Urls(dark, type);
  const mobileUrl = MobuleUrl(dark, type);
  return (
    <div css={[gifContainer]}>
      <div css={[gif, desktop]}>
        <video css={video} autoPlay loop>
          <source src={url[0]} type="video/webm" />
        </video>
      </div>
      <div css={[gif, desktop]}>
        <video css={video} autoPlay loop>
          <source src={url[1]} type="video/webm" />
        </video>
      </div>
      <div css={[gif, mobile, padding]}>
        <video css={video} autoPlay loop>
          <source src={mobileUrl} type="video/webm" />
        </video>
      </div>
    </div>
  );
};

export type Steps = 0 | 1 | 2 | 3 | 4;
export const TutorialSteps = [welcome, algorithms, weights, endPoints, walls];
export const TutorialStepsMobile = [welcome, algorithms, weightsMobile, endPoints, wallsMobile];
export const tutorialHeaders = ['Algorithms: ', 'Weights: ', 'Start & End Points: ', 'Walls: '];
export const LightWall = React.memo(() => <Gif dark={false} type="wall" />);
export const DarkWall = React.memo(() => <Gif dark={true} type="wall" />);
export const LightWeight = React.memo(() => <Gif dark={false} type="weight" />);
export const DarkWeight = React.memo(() => <Gif dark={true} type="weight" />);
export const LightPoints = React.memo(() => <Gif dark={false} type="startPoint" />);
export const DarkPoints = React.memo(() => <Gif dark={true} type="startPoint" />);
