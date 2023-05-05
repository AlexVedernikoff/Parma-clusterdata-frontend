export interface HeaderProps {
  entry?: {
    scope: string;
    key: string;
  };
  place: string;
  path: string;
  rightItems?: JSX.Element[];
  rightButtons?: JSX.Element[];
  actionsBtn?: JSX.Element[];
}
