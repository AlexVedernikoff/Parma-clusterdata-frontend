import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Switch, Modal, Space } from 'antd';

import { DialogType } from '@clustrum-lib/shared/types';
import { getSettings, isDialogVisible } from '../../../store/selectors/dash';
import { closeDialog, setSettings } from '../../../store/actions/dash';

function DashboardSettings(props) {
  const { visible, closeDialog, settings, setSettings } = props;
  const [checked, setChecked] = useState(settings.needSyncFilters ?? false);

  return (
    <Modal
      title="Настройки аналитической панели"
      open={visible}
      cancelText="Отменить"
      onCancel={closeDialog}
      okText="Сохранить"
      onOk={() => {
        setSettings({ ...settings, needSyncFilters: checked });
        closeDialog();
      }}
    >
      <Space>
        <Switch checked={checked} onChange={setChecked} />
        Связать одинаковые фильтры
      </Space>
    </Modal>
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
