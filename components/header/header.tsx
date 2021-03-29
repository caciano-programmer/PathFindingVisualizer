import { SerializedStyles } from '@emotion/react';

type HeaderProps = {
  styles: SerializedStyles;
};

export const Header = ({ styles }: HeaderProps) => <header css={styles}>Header</header>;
