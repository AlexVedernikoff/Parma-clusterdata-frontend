import { LoadedData } from './loaded-data';
import { PropsData } from './props-data';

export interface GoAwayLinkProps {
  loadedData: LoadedData;
  propsData: PropsData;
  urlPostfix?: string;
  idPrefix?: string;
}
