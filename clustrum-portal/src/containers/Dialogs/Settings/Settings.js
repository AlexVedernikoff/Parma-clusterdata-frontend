import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { connect } from 'react-redux';
import { Dialog } from '@kamatech-data-ui/common/src';
import { getSettings, isDialogVisible } from '../../../store/selectors/dash';
import { closeDialog, setSettings } from '../../../store/actions/dash';
import { DIALOG_TYPE } from '../../../modules/constants/constants';

const b = block('dialog-settings');

function Settings({ settings, visible, setSettings, closeDialog }) {
  return settings ? (
    <Dialog visible={visible} onClose={closeDialog} autoclosable={false}>
      <Dialog.Header caption="Настройки" />
      <Dialog.Body className={b()} />
      <Dialog.Footer
        onClickButtonCancel={closeDialog}
        textButtonApply="Сохранить"
        textButtonCancel="Отменить"
        onClickButtonApply={() => {
          setSettings({ ...settings });
          closeDialog();
        }}
      />
    </Dialog>
  ) : null;
}

Settings.propTypes = {
  settings: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  setSettings: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  settings: getSettings(state),
  visible: isDialogVisible(state, DIALOG_TYPE.SETTINGS),
});

const mapDispatchToProps = {
  closeDialog,
  setSettings,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
