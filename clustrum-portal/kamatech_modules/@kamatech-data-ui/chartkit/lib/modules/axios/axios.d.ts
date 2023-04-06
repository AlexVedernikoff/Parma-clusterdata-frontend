export interface AxiosRequest {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  data?: object;
  responseType?: 'arraybuffer' | 'document' | 'json' | 'text' | 'stream' | 'blob';
  headers: object;
}

export interface AxiosResponse<T> {
  data: T;
  headers: any;
}

export default function<T = any>(request: object): Promise<AxiosResponse<T>>;
