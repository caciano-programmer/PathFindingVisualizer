import Link from 'next/link';
import { css } from '@emotion/react';

const container = css({
  height: '85%',
  width: '100%',
});

export default function Home() {
  return (
    <div css={container}>
      <Link href="/path">
        <a>Path</a>
      </Link>
    </div>
  );
}
