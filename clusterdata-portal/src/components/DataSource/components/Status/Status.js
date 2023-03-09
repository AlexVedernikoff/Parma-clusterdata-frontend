import React from 'react';
import moment from 'moment';
import block from 'bem-cn-lite';
import {i18n} from '@parma-data-ui/clusterdata';
import {ProgressBar} from '../ProgressBar/ProgressBar';
import {Stage} from '../../Stage';

const b = block('data-source-status');

export const Status = (
    {
      isDirectDsMode,
      status: {
        isProcessing,
        updated,
        percent_complete: percentComplete,
        stage,
      } = {},
    },
) => {
  const lastDateTime = updated * 1000;
  const lastDate = moment(lastDateTime).format('DD.MM.YYYY');
  const lastTime = moment(lastDateTime).format('HH:mm');
  const statusLabel = _statusLabel();

  function _statusLabel() {
    if (isDirectDsMode) {
      return i18n('dataset.materialization.modify', 'label_not-loaded-yet');
    }

    if (isProcessing) {
      return i18n('dataset.materialization.modify', 'label_loading');
    }

    if (updated) {
      if (stage === Stage.DONE) {
        return i18n('dataset.materialization.modify', 'label_last-update', {
          date: lastDate,
          time: lastTime,
        });
      }

      if (stage === Stage.FAILED) {
        return i18n('dataset.materialization.modify', 'label_loading-failed', {
          date: lastDate,
          time: lastTime,
        });
      }
    }
  }

  return (
      <React.Fragment>
        {
            !isDirectDsMode && (
                <ProgressBar
                    current={percentComplete}
                    stage={stage}
                />
            )
        }
        {
            !isProcessing && (
                <span
                    className={b('last-loaded')}
                    dangerouslySetInnerHTML={{__html: statusLabel}}
                />
            )
        }
      </React.Fragment>
  );
};
