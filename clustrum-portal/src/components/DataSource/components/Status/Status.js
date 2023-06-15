import React from 'react';
import moment from 'moment';
import block from 'bem-cn-lite';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { Stage } from '../../Stage';

const b = block('data-source-status');

export const Status = ({
  isDirectDsMode,
  status: { isProcessing, updated, percent_complete: percentComplete, stage } = {},
}) => {
  const lastDateTime = updated * 1000;
  const lastDate = moment(lastDateTime).format('DD.MM.YYYY');
  const lastTime = moment(lastDateTime).format('HH:mm');
  const statusLabel = _statusLabel();

  function _statusLabel() {
    if (isDirectDsMode) {
      return 'Данные в этом датасете еще не загружались. Для загрузки нажмите <b>Сохранить</b> или <b>Загрузить сейчас</b>';
    }

    if (isProcessing) {
      return 'Загрузка данных';
    }

    if (updated) {
      if (stage === Stage.DONE) {
        return `Обновлено ${lastDate} в ${lastTime}`;
      }

      if (stage === Stage.FAILED) {
        return `${lastDate} в ${lastTime}`;
      }
    }
  }

  return (
    <React.Fragment>
      {!isDirectDsMode && <ProgressBar current={percentComplete} stage={stage} />}
      {!isProcessing && (
        <span
          className={b('last-loaded')}
          dangerouslySetInnerHTML={{ __html: statusLabel }}
        />
      )}
    </React.Fragment>
  );
};
