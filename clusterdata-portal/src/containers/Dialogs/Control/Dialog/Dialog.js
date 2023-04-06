import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Dialog as CommonDialog } from '@kamatech-data-ui/common/src';

import { i18n } from '@kamatech-data-ui/clusterdata';

// import './Dialog.scss';

const b = block('sub-dialog-control');

function Dialog(props) {
  const { visible, caption, onApply, onClose, children } = props;
  return (
    <CommonDialog visible={visible} onClose={onClose}>
      <div className={b()}>
        <CommonDialog.Header caption={caption} />
        <CommonDialog.Body>
          {/* класс специально не выносится в props в Body, чтобы был правильный скролл */}
          <div className={b('body')}>{visible ? children : null}</div>
        </CommonDialog.Body>
        <CommonDialog.Footer
          onClickButtonCancel={onClose}
          onClickButtonApply={onApply}
          textButtonApply={i18n('dash.control-dialog.edit', 'button_apply')}
          textButtonCancel={i18n('dash.control-dialog.edit', 'button_cancel')}
        />
      </div>
    </CommonDialog>
  );
}

Dialog.propTypes = {
  visible: PropTypes.bool,
  caption: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  children: PropTypes.any,
};

export default Dialog;
