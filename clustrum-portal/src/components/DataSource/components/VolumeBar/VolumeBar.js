import React from 'react';
import block from 'bem-cn-lite';

import Utils from '../../../../helpers/utils';

// import './VolumeBar.scss';

const b = block('volume-bar');

function VolumeBar(props) {
  const { current, max } = props;

  const occupiedPercent = Math.round((current / max) * 100);

  return (
    <div className={b('progress-line-panel')}>
      <div className={b('occupied-info')}>
        <span>{Utils.bytesToSize(current)}</span>
        <span>{Utils.bytesToSize(max)}</span>
      </div>
      <div className={b('progress-line', b('margin', { bottom: 5, top: 5 }))}>
        <div
          className={b('progress-line-occupied')}
          style={{ width: `${occupiedPercent}%` }}
        />
      </div>
      <div className={b('sub-info')}>
        <span>занято</span>
      </div>
    </div>
  );
}

export default VolumeBar;
