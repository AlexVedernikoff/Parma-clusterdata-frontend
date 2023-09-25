import '../EntryIcon/EntryIcon';
import '../PathSelect/PathSelect';
import { NOTIFY_TYPES } from '../../constants/common';
import Utils from '../../utils';

import EntryDialogues from '@kamatech-data-ui/common/src/components/EntryDialogues/EntryDialogues';
import DialogSaveWidget from './DialogSaveWidget/DialogSaveWidget';
import DialogCreateDashboard from './DialogCreateDashboard/DialogCreateDashboard';
import DialogUnlock from './DialogUnlock/DialogUnlock';
import DialogAccess from './DialogAccess/DialogAccess';
import DialogSaveEditorChart from './DialogSaveEditorChart/DialogSaveEditorChart';
import { NotificationType } from '@shared/types/notification';

export const ENTRY_DIALOG = {
  COPY: 'copy',
  MOVE: 'move',
  RENAME: 'rename',
  DELETE: 'delete',
  DESCRIBE: 'describe',
  CREATE_FOLDER: 'create_folder',
  CREATE_DASHBOARD: 'create_dashboard',
  SAVE_WIDGET: 'save_widget',
  UNLOCK: 'unlock',
  ACCESS: 'access',
  SAVE_EDITOR_CHART: 'save_editor_chart',
};

export const entryDialoguesNotify = (dialogName, errorDialogRef, openNotification) => ({
  message: title,
  type,
  error,
}) => {
  switch (dialogName) {
    case ENTRY_DIALOG.SAVE_WIDGET:
    case ENTRY_DIALOG.CREATE_DASHBOARD:
    case ENTRY_DIALOG.DELETE:
    case ENTRY_DIALOG.CREATE_FOLDER:
    case ENTRY_DIALOG.MOVE:
    case ENTRY_DIALOG.RENAME:
    case ENTRY_DIALOG.DESCRIBE:
    case ENTRY_DIALOG.COPY:
    case ENTRY_DIALOG.SAVE_EDITOR_CHART:
      console.log('asdfas');
      openNotification({
        message: title,
        key: `${dialogName}_${NotificationType.Error}`,
        type: NotificationType.Error,
      });
      return;
      if (true) {
        const { message, requestId } = Utils.parseErrorResponse(error);
        let actions;
        let allowAutoHiding = true;
        if (message && errorDialogRef && errorDialogRef.current) {
          allowAutoHiding = false;
          actions = [
            {
              label: 'Подробнее',
              onClick() {
                errorDialogRef.current.open({
                  message,
                  title,
                  requestId,
                });
              },
            },
          ];
        }
        const duration = allowAutoHiding ? 6 : 0;
        openNotification({
          message: title,
          key: `${dialogName}_${NotificationType.Error}`,
          type: NotificationType.Error,
          duration: duration,
          actions,
        });
      }
      break;
  }
};

EntryDialogues.dialogs = {
  ...EntryDialogues.dialogs,
  [ENTRY_DIALOG.SAVE_WIDGET]: DialogSaveWidget,
  [ENTRY_DIALOG.CREATE_DASHBOARD]: DialogCreateDashboard,
  [ENTRY_DIALOG.UNLOCK]: DialogUnlock,
  [ENTRY_DIALOG.ACCESS]: DialogAccess,
  [ENTRY_DIALOG.SAVE_EDITOR_CHART]: DialogSaveEditorChart,
};

export default EntryDialogues;
