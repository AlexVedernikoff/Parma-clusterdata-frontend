import { SDK, Style as SDKStyle } from '../../../modules/sdk';
import { Style } from './types/Style';

export const getStyles = (): Promise<Style[]> => {
  return SDK.getStyles()
    .then(({ items }: { items: SDKStyle[] }): Style[] => items)
    .catch((error): Style[] => {
      console.error(error);

      return [];
    });
};
