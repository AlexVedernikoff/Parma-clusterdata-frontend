export interface HeaderProps {
  entry?: {
    scope: string;
    key: string;
  };
  place: string;
  path: string;
  rightSideContent: JSX.Element[];
  leftSideContent?: JSX.Element[];
}
