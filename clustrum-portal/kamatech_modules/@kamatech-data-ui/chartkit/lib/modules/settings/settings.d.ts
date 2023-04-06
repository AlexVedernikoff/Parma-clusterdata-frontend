import { AxiosRequest } from '../axios/axios';

declare const settings: {
  set(newSettings: object): void;
  requestDecorator(request: AxiosRequest): object;
  requestIdGenerator(): string;
  readonly chartsEndpoint: string;
  readonly exportEndpoint: string;
  readonly statfaceEndpoint: string;
  readonly lang: string;
  readonly config: object;
  readonly theme: string;
  readonly isProd: boolean;
  readonly menu: any;
};

export default settings;
