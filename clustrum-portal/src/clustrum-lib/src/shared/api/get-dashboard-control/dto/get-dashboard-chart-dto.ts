import { DateParams } from '@lib-shared/ui/filter-controls-factory/types';
import { CancelToken } from 'axios';

interface Params {
  [key: string]: string | string[] | DateParams;
}

export interface DataProps {
  cancelToken: CancelToken;
  id: string | undefined;
  params: Params;
}
