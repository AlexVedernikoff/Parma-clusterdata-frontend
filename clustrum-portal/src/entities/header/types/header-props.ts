import { BreadcrumbItem } from './breadcrumb-item';

export interface HeaderProps {
  path: BreadcrumbItem[];
  title?: string;
  rightSideContent?: JSX.Element;
  leftSideContent?: JSX.Element;
}
