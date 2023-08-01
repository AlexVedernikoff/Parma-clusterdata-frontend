import { ErrorCode } from '@lib-shared/types';

export const DATASET_ERROR_MESSAGES = {
  [ErrorCode.Forbidden]: 'У вас нет доступа к датасету',
  [ErrorCode.NotFound]: 'Набор данных не найден',
  [ErrorCode.ServerError]: 'Ошибка: не удалось загрузить датасет',
  Unknown: 'Ошибка: не удалось загрузить датасет',
};
