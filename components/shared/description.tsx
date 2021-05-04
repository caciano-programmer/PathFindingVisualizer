import KettlebellSvg from '../../public/kettlebell.svg';
import StartSvg from '../../public/start.svg';
import DestinationSvg from '../../public/end.svg';
import { css, SerializedStyles } from '@emotion/react';

const descriptionCss = (size: string) =>
  css({
    fontSize: size,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '100%',
    width: '100%',
    textAlign: 'center',
    cursor: 'text',
  });
const descriptionIconCss = (size: string) => css({ width: size, height: size, marginBottom: '-2px' });
const descriptionCellCss = (size: string) =>
  css({
    border: '1px solid black',
    width: size,
    height: size,
    display: 'inline-block',
    margin: '0 0 -2px 2px',
  });
const marginDescriptionIcon = (spacing = '.5vw') => css({ marginRight: spacing });

type DescriptionProps = { size: string; spacing?: string; styles?: SerializedStyles };

export const Description = ({ size, spacing, styles }: DescriptionProps) => {
  const description = descriptionCss(size);
  const descriptionIcon = descriptionIconCss(size);
  const descriptionCell = descriptionCellCss(size);
  const cellSpacing = marginDescriptionIcon(spacing);

  return (
    <div css={[description, styles]}>
      <div>
        <span>Start: </span>
        <StartSvg css={[descriptionIcon, cellSpacing]} />
        <span>End: </span>
        <DestinationSvg css={descriptionIcon} />
      </div>
      <div>
        <span>Clear: </span>
        <div css={[descriptionCell, cellSpacing]} />
        <span>Wall: </span>
        <div css={descriptionCell} />
      </div>
      <div>
        <span>Visited: </span>
        <div css={[descriptionCell, cellSpacing]} />
        <span>Path: </span>
        <div css={descriptionCell} />
      </div>
      <div>
        <span>Small Weight: </span>
        <KettlebellSvg css={descriptionIcon} />
      </div>
      <div>
        <span>Large Weight: </span>
        <KettlebellSvg css={descriptionIcon} />
      </div>
    </div>
  );
};
