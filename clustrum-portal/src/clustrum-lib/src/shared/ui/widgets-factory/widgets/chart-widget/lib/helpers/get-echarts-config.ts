import { prepareData } from './prepare-data';
import { prepareConfig } from './prepare-config';
import { drawComments } from './drawing';

export const getEchartsConfig = (
  options: any,
  data: any,
  vaultId: any,
  comments: any,
): any => {
  prepareData(data, options);
  console.log('data', data);
  return {
    // TODO: подумать над тем, как правильнее мержить комментарии, может стоит это делать сразу после api/run
    // TODO: чтобы подавать в отрисовку готовые данные
    config: Object.assign({
      _comments: [...(comments || []), ...(data.comments || [])],
      ...prepareConfig(data, options, vaultId),
    }),
  };
};
