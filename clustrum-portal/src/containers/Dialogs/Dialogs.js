import React from 'react';
import { connect } from 'react-redux';

import Tabs from './Tabs/Tabs';
import Title from './Title/Title';
import Text from './Text/Text';
import Widget from './Widget/Widget';
import Control from './Control/Control';
import Settings from './Settings/Settings';

import { DIALOG_TYPE } from '../../modules/constants/constants';

// TODO: посмотреть не будут ли тормозить диалоги со сложным содержимым из-за того, что происходит mount/unmount
// TODO: если будут заметны лаги, то можно будет рендерить содержимое диалогов по мере доступности
// TODO: однако это содержимое по сути не нужно тем, кто не собирается редактировать дашборд
function Dialogs({ openedDialog }) {
  switch (openedDialog) {
    case DIALOG_TYPE.TABS:
      return <Tabs />;
    case DIALOG_TYPE.TITLE:
      return <Title />;
    case DIALOG_TYPE.TEXT:
      return <Text />;
    case DIALOG_TYPE.WIDGET:
      return <Widget />;
    case DIALOG_TYPE.CONTROL:
      return <Control />;
    case DIALOG_TYPE.SETTINGS:
      return <Settings />;
  }
  return null;
}

const mapStateToProps = state => ({
  openedDialog: state.dash.openedDialog,
});

export default connect(mapStateToProps)(Dialogs);
