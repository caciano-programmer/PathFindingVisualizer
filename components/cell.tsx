import { Dispatch, SetStateAction, useState } from 'react';
import { css } from '@emotion/react';

const getCellCss = (visited: boolean) =>
  css({ border: '1px solid black', backgroundColor: visited ? 'blue' : 'white' });

export const Cell = ({ clicked }: { clicked: boolean }) => {
  const [visited, setVisited] = useState(false);
  const cellCss = getCellCss(visited);
  return <div css={cellCss} onMouseOver={() => visit(setVisited, clicked)} onMouseDown={() => visit(setVisited)} />;
};

function visit(setVisited: Dispatch<SetStateAction<boolean>>, clicked = true) {
  if (clicked) setVisited((prev: boolean) => !prev);
}
