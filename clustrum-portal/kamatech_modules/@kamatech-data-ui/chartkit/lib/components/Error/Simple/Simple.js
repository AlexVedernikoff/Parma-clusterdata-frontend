import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Button } from 'lego-on-react';

import { ERROR_TYPE } from '../../../modules/error-dispatcher/error-dispatcher';
import More from '../More/More';

import { URL_OPTIONS } from '../../../modules/constants/constants';

// import '../Error.scss';

const b = block('chartkit-error');

function handler(handledError) {
  const { type, error, extra = {} } = handledError;

  switch ((extra.error && extra.error.errorType) || type) {
    case ERROR_TYPE.CONFIG_LOADING_ERROR:
      if (extra.error && extra.error.code) {
        switch (extra.error.code) {
          case 403:
            return { title: 'Нет прав на просмотр' };
          case 404:
            return {
              title: 'Диаграмма не найдена',
              more:
                (extra.error && extra.error.messageError ? extra.error.messageError : '') ||
                extra.executionError ||
                extra.stackTrace,
            };
        }
      }
      return { title: 'Ошибка: не удалось загрузить чарт' };
    case ERROR_TYPE.TOO_MANY_LINES:
      return {
        title: 'Превышено рекомендуемое число рядов',
        retryText: 'Отобразить',
        retryParams: { [URL_OPTIONS.WITHOUT_LINE_LIMIT]: 1 },
      };
    case ERROR_TYPE.NO_DATA:
      return { title: 'Нет данных' };
    case ERROR_TYPE.RENDER_ERROR:
      console.error(error);
      return { title: 'Ошибка при рендеринге' };
    case ERROR_TYPE.UNSUPPORTED_EXTENSION:
      console.error(extra.error && extra.error.stackTrace);

      return {
        title: 'Неподдерживаемый тип скрипта',
        more:
          (extra.error && extra.error.messageError ? extra.error.messageError : '') ||
          extra.executionError ||
          extra.stackTrace,
      };
    case ERROR_TYPE.EXECUTION_ERROR: {
      console.error(extra.tabName, extra.executionError || extra.stackTrace);

      return {
        title: 'Ошибка выполнения скрипта',
        more:
          (extra.error && extra.error.messageError ? extra.error.messageError : '') ||
          extra.executionError ||
          extra.stackTrace,
      };
    }
    case ERROR_TYPE.EXCEEDED_DATA_LIMIT: {
      console.error(extra.tabName, extra.executionError || extra.stackTrace);

      return {
        title: 'Превышен лимит данных. Попробуйте добавить или изменить фильтры',
        more:
          (extra.error && extra.error.messageError ? extra.error.messageError : '') ||
          extra.executionError ||
          extra.stackTrace,
      };
    }
    case ERROR_TYPE.UNKNOWN_ERROR:
      return { title: 'Произошла ошибка' };
    default:
      console.error(handledError);
      return handledError;
  }
}

function Simple(originalProps) {
  const props = { extraLines: [], retryParams: {}, ...originalProps, ...handler(originalProps.data.error) };
  const type = originalProps.data.error.type;

  return (
    <div className={b({ [type]: Boolean(type) })}>
      <div className={b('title')}>{props.title || 'Ошибка сети'}</div>

      <div className={b('retry')}>
        <Button
          theme="action"
          tone="default"
          view="default"
          size="m"
          onClick={() => props.retryClick(props.retryParams)}
        >
          {props.retryText || 'Повторить'}
        </Button>

        {props.more ? <More requestId={props.requestId} text={props.more} /> : null}
      </div>
    </div>
  );
}

Simple.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  requestId: PropTypes.string.isRequired,
  retryClick: PropTypes.func.isRequired,
};

export default Simple;
