import { IEntryProps } from './IEntryProps';

export interface IHeaderPropsObject {
  entry?: IEntryProps;
  rightItems: Array<JSX.Element>;
  path: string;
  place: string;
}
