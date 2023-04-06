import React from 'react';
import block from 'bem-cn-lite';
import { i18n } from '@kamatech-data-ui/clusterdata';
import { Stage } from '../../Stage';

const b = block('progress-bar');

export const ProgressBar = props => {
  const { current, stage } = props;
  let labelStage;
  let barColor = 'loading';

  switch (stage) {
    case Stage.EMPTY:
      labelStage = i18n('dataset.materialization.modify', 'label_status-empty');
      break;
    case Stage.INITIALIZING:
      labelStage = i18n('dataset.materialization.modify', 'label_initializing');
      break;
    case Stage.COPYING:
      labelStage = i18n('dataset.materialization.modify', 'label_copying');
      break;
    case Stage.SAVING_META:
      labelStage = i18n('dataset.materialization.modify', 'label_saving-meta');
      break;
    case Stage.DONE:
      labelStage = i18n('dataset.materialization.modify', 'label_done');
      break;
    case Stage.FAILED:
      barColor = 'failed';
      labelStage = i18n('dataset.materialization.modify', 'label_failed');
      break;
    default:
      labelStage = i18n('dataset.materialization.modify', 'label_loading');
  }

  return (
    <div className={b()}>
      <div className={b('occupied-info')}>
        <span>{`${current}%`}</span>
      </div>
      <div className={b('progress-line')}>
        <div className={b('progress-line-occupied', { 'bar-color': barColor })} style={{ width: `${current}%` }} />
      </div>
      <div className={b('sub-info')}>
        <span>{labelStage.toLowerCase()}</span>
      </div>
    </div>
  );
};
