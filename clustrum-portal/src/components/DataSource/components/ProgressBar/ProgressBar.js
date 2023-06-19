import React from 'react';
import block from 'bem-cn-lite';
import { Stage } from '../../Stage';

const b = block('progress-bar');

export const ProgressBar = props => {
  const { current, stage } = props;
  let labelStage;
  let barColor = 'loading';

  switch (stage) {
    case Stage.EMPTY:
      labelStage = 'Не запущено';
      break;
    case Stage.INITIALIZING:
      labelStage = 'Инициализация';
      break;
    case Stage.COPYING:
      labelStage = 'Загрузка данных';
      break;
    case Stage.SAVING_META:
      labelStage = 'Сохранение';
      break;
    case Stage.DONE:
      labelStage = 'Выполнено';
      break;
    case Stage.FAILED:
      barColor = 'failed';
      labelStage = 'Ошибка';
      break;
    default:
      labelStage = 'Загрузка данных';
  }

  return (
    <div className={b()}>
      <div className={b('occupied-info')}>
        <span>{`${current}%`}</span>
      </div>
      <div className={b('progress-line')}>
        <div
          className={b('progress-line-occupied', { 'bar-color': barColor })}
          style={{ width: `${current}%` }}
        />
      </div>
      <div className={b('sub-info')}>
        <span>{labelStage.toLowerCase()}</span>
      </div>
    </div>
  );
};
