export interface HeaderProps {
  entry?: {
    scope: string;
    key: string;
  };
  place: string;
  path: string;
  rightItems?: JSX.Element[];
  rightSideContent?: JSX.Element[];
  leftSideContent?: JSX.Element[];
}
