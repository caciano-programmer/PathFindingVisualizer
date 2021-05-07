import { css } from '@emotion/react';
import React, { useContext } from 'react';
import ReactDOMServer from 'react-dom/server';
import Highlighter from 'react-highlight-words';
import { codeText, highlightTypes } from './codeUtils';
import CloseSvg from '../../public/exit.svg';
import { DESKTOP, MOBILE } from '../../config/config';
import { Dark, Light, MyTheme, Theme } from '../../theme/theme';

const fullSize = { width: '100%', height: '100%' };
const scrollbarCss = ({ scrollbar }: Theme) =>
  css({
    '&::-webkit-scrollbar': { width: '.6vw', height: '.6vw' },
    '&::-webkit-scrollbar-thumb': { background: scrollbar.thumb, borderRadius: '.3vw' },
    '&::-webkit-scrollbar-track': { background: scrollbar.track, borderRadius: '.3vw', margin: '1vw .5vw .5vw 1vw' },
    '&::-webkit-scrollbar-corner': { backgroundColor: 'inherit' },
  });
const getWrapper = (visible: boolean) =>
  css({ position: 'fixed', top: visible ? 0 : '-100%', ...fullSize, transition: 'top .4s linear', zIndex: 2 });
const headerCss = (theme: Theme) =>
  css({
    position: 'relative',
    height: '10%',
    width: '100%',
    backgroundColor: theme.background,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.main}`,
    boxShadow: `0 0 10px ${theme.main}`,
    clipPath: 'inset(0px 0px -10px 0px)',
    color: theme.main,
  });
const title = css({
  [DESKTOP]: { flex: 15 },
  [MOBILE]: { flex: 5 },
  paddingLeft: '2%',
  fontSize: '6vh',
  fontWeight: 500,
});
const iconContainer = css({ flex: 1, cursor: 'pointer', paddingRight: '2%' });
const iconCss = (theme: Theme) =>
  css({ ...fullSize, fill: theme.main, [DESKTOP]: { '&:hover': { filter: `drop-shadow(0 0 .5vw ${theme.main})` } } });
const codeContainerCss = (theme: Theme) =>
  css({
    width: '100%',
    height: '90%',
    overflow: 'auto',
    backgroundColor: theme.background,
  });
const text = (theme: Theme) => css({ fontSize: 'max(1.4vw, 1.3vh)', color: theme.code.others });

const codeString = codeText;
const { keywords, functions, separators, comments } = highlightTypes;
const all = [...keywords, ...functions, ...comments, ...separators];

const dark = getHighlight(Dark);
const light = getHighlight(Light);
const lightText = text(Light);
const darkText = text(Dark);

const darkJsx = ReactDOMServer.renderToString(
  <div css={[fullSize, darkText]}>
    <Highlighter textToHighlight={codeString} searchWords={all} caseSensitive autoEscape highlightTag={dark} />
  </div>,
);
const lightJsx = ReactDOMServer.renderToString(
  <div css={[fullSize, lightText]}>
    <Highlighter textToHighlight={codeString} searchWords={all} caseSensitive autoEscape highlightTag={light} />
  </div>,
);

type CodeProps = { isOpen: boolean; close: () => void };

const Code = ({ isOpen, close }: CodeProps) => {
  const theme = useContext(MyTheme);
  const wrapper = getWrapper(isOpen);

  const header = headerCss(theme);
  const codeContainer = codeContainerCss(theme);
  const icon = iconCss(theme);
  const scrollbar = scrollbarCss(theme);

  return (
    <div css={wrapper}>
      <div css={header}>
        <div css={title}>Algorithms</div>
        <div css={iconContainer} onClick={close}>
          <CloseSvg css={icon} />
        </div>
      </div>
      <div css={[codeContainer, scrollbar]}>
        <pre css={fullSize}>
          <code css={fullSize} dangerouslySetInnerHTML={{ __html: theme.isDark ? darkJsx : lightJsx }} />
        </pre>
      </div>
    </div>
  );
};

export default React.memo(Code);

function getHighlight({ code }: Theme) {
  return function highlight({ children }: { children: string }) {
    let color = code.separators;
    if (comments.includes(children)) color = code.comments;
    else if (keywords.includes(children)) color = code.keywords;
    else if (functions.includes(children)) color = code.functions;
    return <span style={{ color }}>{children}</span>;
  };
}
