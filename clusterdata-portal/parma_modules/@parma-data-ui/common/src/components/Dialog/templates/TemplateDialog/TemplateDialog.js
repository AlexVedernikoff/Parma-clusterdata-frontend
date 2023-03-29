import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '../../Dialog';

const TemplateDialog = ({
  preset,
  children,
  visible,
  onClose,
  caption,
  textButtonApply,
  textButtonCancel,
  onClickButtonApply,
  progress,
  errorText,
  showError,
  listenKeyEnter,
}) => {
  return (
    <Dialog visible={visible} onClose={onClose}>
      <Dialog.Header caption={caption} />
      <Dialog.Body>{children}</Dialog.Body>
      <Dialog.Footer
        preset={preset}
        onClickButtonCancel={onClose}
        onClickButtonApply={onClickButtonApply}
        textButtonApply={textButtonApply}
        textButtonCancel={textButtonCancel}
        progress={progress}
        errorText={errorText}
        showError={showError}
        listenKeyEnter={listenKeyEnter}
      />
    </Dialog>
  );
};

TemplateDialog.propTypes = {
  onClose: PropTypes.func,
  visible: PropTypes.bool,
  children: PropTypes.any,
  caption: PropTypes.string,
  preset: PropTypes.string,
  textButtonApply: PropTypes.string,
  textButtonCancel: PropTypes.string,
  onClickButtonApply: PropTypes.func,
  progress: PropTypes.bool,
  errorText: PropTypes.string,
  showError: PropTypes.bool,
  listenKeyEnter: PropTypes.bool,
};

TemplateDialog.defaultProps = {
  textButtonApply: 'Готово',
  textButtonCancel: 'Отменить',
  caption: 'Заголовок',
  preset: 'default',
  listenKeyEnter: false,
};

export default TemplateDialog;
