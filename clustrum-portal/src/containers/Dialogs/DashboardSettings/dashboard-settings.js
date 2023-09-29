import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Switch } from 'antd';

import Dialog from '@kamatech-data-ui/common/src/components/Dialog/Dialog';
import { DialogType } from '@clustrum-lib/shared/types';
import { getSettings, isDialogVisible } from '../../../store/selectors/dash';
import { closeDialog, setSettings } from '../../../store/actions/dash';

function DashboardSettings(props) {
  const { visible, closeDialog, settings, setSettings } = props;
  const [checked, setChecked] = useState(settings.needSyncFilters ?? false);

  return (
    <Dialog visible={visible} onClose={closeDialog}>
      <Dialog.Header caption="Настройки аналитической панели" />
      <Dialog.Body>
        <Switch checked={checked} onChange={setChecked} />
        Связать одинаковые фильтры
      </Dialog.Body>
      <Dialog.Footer
        textButtonApply="Сохранить"
        textButtonCancel="Отменить"
        onClickButtonCancel={closeDialog}
        onClickButtonApply={() => {
          setSettings({ ...settings, needSyncFilters: checked });
          closeDialog();
        }}
      />
    </Dialog>
  );
}

const mapStateToProps = state => ({
  settings: getSettings(state),
  visible: isDialogVisible(state, DialogType.DashboardSettings),
});

const mapDispatchToProps = {
  setSettings,
  closeDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSettings);
