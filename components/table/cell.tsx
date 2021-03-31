import { Dispatch, SetStateAction, useState } from 'react';
import { css, SerializedStyles } from '@emotion/react';

const getCellCss = (visited: boolean) =>
  css({ border: '1px solid black', backgroundColor: visited ? 'blue' : 'white' });

type CellProps = { clicked: boolean; value: number; styles?: SerializedStyles };

export const Cell = ({ clicked, value, styles }: CellProps) => {
  const [visited, setVisited] = useState(false);
  const cellCss = getCellCss(visited);
  return (
    <div css={[cellCss, styles]} onMouseOver={() => visit(setVisited, clicked)} onClick={() => visit(setVisited)} />
  );
};

function visit(setVisited: Dispatch<SetStateAction<boolean>>, clicked = true) {
  if (clicked) setVisited((prev: boolean) => !prev);
}
