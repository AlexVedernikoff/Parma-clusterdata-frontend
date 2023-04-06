import '../EntryIcon/EntryIcon';
import '../PathSelect/PathSelect';
import Toaster from '@kamatech-data-ui/common/src/components/Toaster';
import { NOTIFY_TYPES } from '../../constants/common';
import Utils from '../../utils';
import { i18n } from '../../utils/i18n';

import EntryDialogues from '@kamatech-data-ui/common/src/components/EntryDialogues/EntryDialogues';
import DialogSaveWidget from './DialogSaveWidget/DialogSaveWidget';
import DialogCreateDashboard from './DialogCreateDashboard/DialogCreateDashboard';
import DialogUnlock from './DialogUnlock/DialogUnlock';
import DialogAccess from './DialogAccess/DialogAccess';
import DialogSaveEditorChart from './DialogSaveEditorChart/DialogSaveEditorChart';

export const ENTRY_DIALOG = {
  COPY: 'copy',
  MOVE: 'move',
  RENAME: 'rename',
  DELETE: 'delete',
  CREATE_FOLDER: 'create_folder',
  CREATE_DASHBOARD: 'create_dashboard',
  SAVE_WIDGET: 'save_widget',
  UNLOCK: 'unlock',
  ACCESS: 'access',
  SAVE_EDITOR_CHART: 'save_editor_chart',
};

export const entryDialoguesNotify = (dialogName, errorDialogRef) => ({ message: title, type, error }) => {
  // eslint-disable-line no-unused-vars
  const toaster = new Toaster();
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
      if (type === NOTIFY_TYPES.ERROR) {
        const { message, requestId } = Utils.parseErrorResponse(error);
        let actions;
        let allowAutoHiding = true;
        if (message && errorDialogRef && errorDialogRef.current) {
          allowAutoHiding = false;
          actions = [
            {
              label: i18n('component.toast.view', 'label_error-detail'),
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
        toaster.createToast({
          title,
          name: `${dialogName}_${NOTIFY_TYPES.ERROR}`,
          type: NOTIFY_TYPES.ERROR,
          allowAutoHiding,
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
