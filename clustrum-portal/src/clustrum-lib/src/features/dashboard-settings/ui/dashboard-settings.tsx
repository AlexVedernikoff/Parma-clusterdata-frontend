import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Switch, Modal, Space } from 'antd';

import { DialogType } from '@lib-shared/types';
// eslint-disable-next-line
// @ts-ignore
import { getSettings, isDialogVisible } from '../../../../../store/selectors/dash';
import { closeDialog, setSettings } from '../../../../../store/actions/dash';
import {
  DashboardSettingsProps,
  DashboardSettingsState,
} from '../types/dashboard-settings-props';

function DashboardSettings(props: DashboardSettingsProps): JSX.Element {
  const { visible, closeDialog, settings, setSettings } = props;
  const [checked, setChecked] = useState(settings.needSyncFilters ?? false);

  return (
    <Modal
      title="Настройки аналитической панели"
      open={visible}
      cancelText="Отменить"
      onCancel={closeDialog}
      okText="Сохранить"
      onOk={(): void => {
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

const mapStateToProps = (state: unknown): DashboardSettingsState => ({
  settings: getSettings(state),
  visible: isDialogVisible(state, DialogType.DashboardSettings),
});

const mapDispatchToProps = {
  setSettings,
  closeDialog,
};

export const DashboardSettingsComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardSettings);
