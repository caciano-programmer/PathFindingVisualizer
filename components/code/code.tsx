import { css } from '@emotion/react';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Highlighter from 'react-highlight-words';
import { codeText, highlightTypes } from './codeUtils';

const container = css({
  position: 'fixed',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  overflow: 'auto',
  backgroundColor: 'gray',
  zIndex: 999,
});
const fullSize = css({ width: '100%', height: '100%' });

const codeString = codeText;
const { keywords, functions, separators, comments } = highlightTypes;
const all = [...keywords, ...functions, ...comments, ...separators];

const darkJsx = ReactDOMServer.renderToString(
  <Highlighter textToHighlight={codeString} searchWords={all} caseSensitive autoEscape highlightTag={Highlight} />,
);

// const lightJsx = ReactDOMServer.renderToString(
//   <Highlighter textToHighlight={codeString} searchWords={all} caseSensitive autoEscape highlightTag={} />,
// );

const Code = () => (
  <div css={container}>
    <pre css={fullSize}>
      <code css={fullSize}>
        <div css={fullSize} dangerouslySetInnerHTML={{ __html: darkJsx }} />
      </code>
    </pre>
  </div>
);

export default React.memo(Code);

function Highlight({ children }: { children: string }) {
  let color = 'white';
  if (comments.includes(children)) color = 'orange';
  else if (keywords.includes(children)) color = 'red';
  else if (functions.includes(children)) color = 'blue';
  return <span style={{ color }}>{children}</span>;
}
