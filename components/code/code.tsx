import { css } from '@emotion/react';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Highlighter from 'react-highlight-words';
import { codeText, highlightTypes } from './codeUtils';
import CloseSvg from '../../public/exit.svg';
import { DESKTOP, MOBILE } from '../../config/config';

const fullSize = { width: '100%', height: '100%' };
const getWrapper = (visible: boolean) =>
  css({ position: 'fixed', top: visible ? 0 : '-100%', ...fullSize, transition: 'top .4s linear' });
const header = css({
  position: 'relative',
  height: '10%',
  width: '100%',
  backgroundColor: 'gray',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});
const title = css({
  [DESKTOP]: { flex: 15 },
  [MOBILE]: { flex: 5 },
  paddingLeft: '2%',
  fontSize: '6vh',
  fontWeight: 500,
});
const iconContainer = css({ flex: 1, cursor: 'pointer', paddingRight: '2%' });
const icon = css({ ...fullSize, fill: 'white' });
const codeContainer = css({
  width: '100%',
  height: '90%',
  overflow: 'auto',
  backgroundColor: 'lightgray',
});
const text = css({ fontSize: '1.4vw' });

const codeString = codeText;
const { keywords, functions, separators, comments } = highlightTypes;
const all = [...keywords, ...functions, ...comments, ...separators];

const darkJsx = ReactDOMServer.renderToString(
  <Highlighter textToHighlight={codeString} searchWords={all} caseSensitive autoEscape highlightTag={Highlight} />,
);

// const lightJsx = ReactDOMServer.renderToString(
//   <Highlighter textToHighlight={codeString} searchWords={all} caseSensitive autoEscape highlightTag={} />,
// );

type CodeProps = { isOpen: boolean; close: () => void };

const Code = ({ isOpen, close }: CodeProps) => {
  const wrapper = getWrapper(isOpen);
  return (
    <div css={wrapper}>
      <div css={header}>
        <div css={title}>Algorithms</div>
        <div css={iconContainer} onClick={close}>
          <CloseSvg css={icon} />
        </div>
      </div>
      <div css={codeContainer}>
        <pre css={fullSize}>
          <code css={fullSize}>
            <div css={[fullSize, text]} dangerouslySetInnerHTML={{ __html: darkJsx }} />
          </code>
        </pre>
      </div>
    </div>
  );
};

export default React.memo(Code);

function Highlight({ children }: { children: string }) {
  let color = 'darkgray';
  if (comments.includes(children)) color = 'orange';
  else if (keywords.includes(children)) color = 'red';
  else if (functions.includes(children)) color = 'blue';
  return <span style={{ color }}>{children}</span>;
}
