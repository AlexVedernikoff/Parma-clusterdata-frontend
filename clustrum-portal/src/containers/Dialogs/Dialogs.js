import React from 'react';
import { connect } from 'react-redux';
import Title from './Title/Title';
import Widget from './Widget/Widget';
import Control from './Control/Control';
import { DashboardTabsSettings } from '@clustrum-lib';
import DashboardSettings from './DashboardSettings/dashboard-settings';
import { DialogType } from '@clustrum-lib/shared/types';

// TODO: посмотреть не будут ли тормозить диалоги со сложным содержимым из-за того, что происходит mount/unmount
// TODO: если будут заметны лаги, то можно будет рендерить содержимое диалогов по мере доступности
// TODO: однако это содержимое по сути не нужно тем, кто не собирается редактировать дашборд
function Dialogs({ openedDialog }) {
  switch (openedDialog) {
    case DialogType.Tabs:
      return <DashboardTabsSettings />;
    case DialogType.Title:
      return <Title />;
    case DialogType.Widget:
      return <Widget />;
    case DialogType.Control:
      return <Control />;
    case DialogType.DashboardSettings:
      return <DashboardSettings />;
  }
  return null;
}

const mapStateToProps = state => ({
  openedDialog: state.dash.openedDialog,
});

export default connect(mapStateToProps)(Dialogs);
