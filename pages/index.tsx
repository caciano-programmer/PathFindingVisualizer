import { css } from '@emotion/react';
import { HtmlHead } from '../components/htmlHead';

const hotpink = css({
  color: 'hotpink',
});

export default function Home() {
  return (
    <>
      <HtmlHead />
      <div css={hotpink}>Hi</div>
    </>
  );
}
