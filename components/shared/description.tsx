import KettlebellSvg from '../../public/icons/kettlebell.svg';
import StartSvg from '../../public/icons/start.svg';
import DestinationSvg from '../../public/icons/end.svg';
import { css, SerializedStyles } from '@emotion/react';
import { MyTheme, Theme } from '../../theme/theme';
import { useContext } from 'react';
import { DESKTOP, MOBILE } from '../../config/config';

const descriptionCss = (size: string, theme: Theme) =>
  css({
    fontSize: size,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '100%',
    width: '100%',
    textAlign: 'center',
    cursor: 'text',
    color: theme.main,
  });
const startPointCss = (theme: Theme) => css({ fill: theme.secondary });
const descriptionIconCss = (size: string) => css({ width: size, height: size, marginBottom: '-2px' });
const descriptionCellCss = (size: string, theme: Theme) =>
  css({
    border: `1px solid ${theme.grid}`,
    width: size,
    height: size,
    display: 'inline-block',
    margin: '0 0 -2px 2px',
  });
const marginDescriptionIcon = (spacing = '.5vw') => css({ marginRight: spacing });
const wallCss = (theme: Theme) => css({ backgroundColor: theme.grid });
const weightCss = (theme: Theme) => css({ fill: theme.main });
const smallWeightCss = (theme: Theme) => css({ fill: theme.smallWeight });
const largeWeightCss = (theme: Theme) => css({ fill: theme.largeWeight });
const pathCss = (theme: Theme) => css({ backgroundColor: theme.path });
const searchedCss = (theme: Theme) => css({ backgroundColor: theme.searched });
const desktop = css({ [MOBILE]: { display: 'none' } });
const mobile = css({ [DESKTOP]: { display: 'none' } });

type DescriptionProps = { size: string; spacing?: string; styles?: SerializedStyles };

export const Description = ({ size, spacing, styles }: DescriptionProps) => {
  const theme = useContext(MyTheme);

  const description = descriptionCss(size, theme);
  const descriptionIcon = descriptionIconCss(size);
  const descriptionCell = descriptionCellCss(size, theme);
  const startPoint = startPointCss(theme);
  const cellSpacing = marginDescriptionIcon(spacing);
  const smallWeight = smallWeightCss(theme);
  const largeWeight = largeWeightCss(theme);
  const weight = weightCss(theme);
  const wall = wallCss(theme);
  const path = pathCss(theme);
  const searched = searchedCss(theme);

  return (
    <div css={[description, styles]}>
      <div>
        <span>Start: </span>
        <StartSvg css={[descriptionIcon, cellSpacing, startPoint]} />
        <span>End: </span>
        <DestinationSvg css={[descriptionIcon, startPoint]} />
      </div>
      <div>
        <span>Clear: </span>
        <div css={[descriptionCell, cellSpacing]} />
        <span>Wall: </span>
        <div css={[descriptionCell, wall]} />
      </div>
      <div>
        <span>Visited: </span>
        <div css={[descriptionCell, cellSpacing, searched]} />
        <span>Path: </span>
        <div css={[descriptionCell, path]} />
      </div>
      <div css={mobile}>
        <span>Weight: </span>
        <KettlebellSvg css={[descriptionIcon, weight]} />
      </div>
      <div css={desktop}>
        <span>Small Weight: </span>
        <KettlebellSvg css={[descriptionIcon, smallWeight]} />
      </div>
      <div css={desktop}>
        <span>Large Weight: </span>
        <KettlebellSvg css={[descriptionIcon, largeWeight]} />
      </div>
    </div>
  );
};
