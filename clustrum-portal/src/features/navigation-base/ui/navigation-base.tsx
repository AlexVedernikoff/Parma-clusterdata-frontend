import React, { ReactElement, useEffect, useRef } from 'react';
import { Store } from 'effector';
import { Places } from '../../../shared/lib/constants/places';
import { NavigationList } from '../../../shared/api/navigation/navigation-list';
import { ContextMenuActions } from '../../../shared/lib/constants/context-menu-actions';
import { NavigationItem } from '../../../shared/types/navigation-item';
import EntryDialogues, {
  ENTRY_DIALOG,
  entryDialoguesNotify,
} from '../../../../kamatech_modules/@kamatech-data-ui/clustrum/src/components/EntryDialogues/EntryDialogues';
import navigateHelper from '../../../../kamatech_modules/@kamatech-data-ui/clustrum/src/libs/navigateHelper';
import {
  ErrorDialog,
  Utils,
} from '../../../../kamatech_modules/@kamatech-data-ui/clustrum';
import { NavigationEntries } from './navigation-entries/navigation-entries';
import { CreateMenuActionType } from '../lib/constants/create-menu-action-type';
import { DL } from '../../../../kamatech_modules/@kamatech-data-ui/clustrum/src/constants/common';
import { NavItemContextMenuClickParams } from '../types/nav-item-context-menu-click-params';

interface NavigationBase {
  sdk: any;
  path: string;
  place: Places;
  isModalView?: boolean;
  /**
   * TODO: осталось для обратной совместимости со старым кодом
   * поправить после исправления модалок
   */
  currentPageEntry?: any;
  /**
   * TODO: осталось для обратной совместимости со старым кодом
   * поправить после исправления модалок
   */
  onUpdate?: any;
  updateData: () => void;
}

/**
 * это старый компонент, который позволяет подключить к навигации модальные окна, возможно, что он будет не нужен
 * надо смотреть на реализацию новых модальных окон
 * здесь много разных функций старых функций, которые обрабатывают действия с контекстным меню
 * (открываются старые модалки и выполняет crud операции т.д.)
 */
export function NavigationBase(props: NavigationBase): ReactElement {
  const {
    sdk,
    path,
    isModalView = false,
    updateData,
    currentPageEntry,
    onUpdate,
  } = props;

  const refDialogues = useRef() as React.RefObject<EntryDialogues> | undefined;
  const refErrorDialog = useRef() as React.RefObject<ErrorDialog> | undefined;

  /**
   * обновить отображение навигации при помощи моделей из эффектора
   */
  const updateEffector = (response: { status: string }): void => {
    if (response.status === 'success') {
      updateData();
    }
  };

  const onContextMenuClick = ({
    entry,
    action,
  }: NavItemContextMenuClickParams): Promise<void> | boolean => {
    switch (action) {
      case ContextMenuActions.Rename: {
        return renameEntry(entry);
      }
      case ContextMenuActions.Describe: {
        return describeEntry(entry);
      }
      case ContextMenuActions.Move: {
        return moveEntry(entry);
      }
      case ContextMenuActions.Copy: {
        return copyEntry(entry);
      }
      case ContextMenuActions.Delete: {
        return deleteEntry(entry);
      }
      case ContextMenuActions.Access: {
        return accessEntry(entry);
      }
      case ContextMenuActions.CopyLink: {
        return false;
      }
      default:
        return false;
    }
  };

  // TODO: поправить функцию после режактирвоания модальных окон (возможно, она будет не нужна)
  function update(response: { status: string }, entryDialog: any, entry?: any): void {
    if (response.status === 'success') {
      if (onUpdate) {
        props.onUpdate(response);
      } else if (currentPageEntry) {
        switch (entryDialog) {
          case ENTRY_DIALOG.RENAME:
            if (currentPageEntry.entryId === entry.entryId) {
              window.location.reload();
            }
            break;
          case ENTRY_DIALOG.MOVE:
            if ((currentPageEntry.key || '').startsWith(entry.key)) {
              window.location.reload();
            }
            break;
          case ENTRY_DIALOG.DELETE:
            if ((currentPageEntry.key || '').startsWith(entry.key)) {
              navigateHelper.openPlace(entry);
            }
            break;
        }
      }
    }
  }

  async function createFolder(this: any): Promise<void> {
    const response = await refDialogues?.current?.openDialog({
      dialog: ENTRY_DIALOG.CREATE_FOLDER,
      dialogProps: {
        path: path,
        withError: false,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.CREATE_FOLDER, refErrorDialog),
      },
    });
    update(response, ENTRY_DIALOG.CREATE_FOLDER);
    updateEffector(response);
  }

  async function renameEntry(entry: NavigationItem): Promise<void> {
    const response = await refDialogues?.current?.openDialog({
      dialog: ENTRY_DIALOG.RENAME,
      dialogProps: {
        entryId: entry.entryId,
        initName: entry.name,
        withError: false,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.RENAME, refErrorDialog),
      },
    });
    update(response, ENTRY_DIALOG.RENAME, entry);
    updateEffector(response);
  }

  async function describeEntry(entry: NavigationItem): Promise<void> {
    const response = await refDialogues?.current?.openDialog({
      dialog: ENTRY_DIALOG.DESCRIBE,
      dialogProps: {
        entryId: entry.entryId,
        description: entry.description,
        withError: false,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.DESCRIBE, refErrorDialog),
      },
    });
    update(response, ENTRY_DIALOG.DESCRIBE, entry);
    updateEffector(response);
  }

  async function moveEntry(entry: NavigationItem): Promise<void> {
    const response = await refDialogues?.current?.openDialog({
      dialog: ENTRY_DIALOG.MOVE,
      dialogProps: {
        entryId: entry.entryId,
        initDestination: path,
        inactiveEntryKey: entry.scope === 'folder' ? entry.key : undefined,
        withError: false,
        sdk,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.MOVE, refErrorDialog),
      },
    });
    update(response, ENTRY_DIALOG.MOVE, entry);
    updateEffector(response);
  }

  async function copyEntry(entry: NavigationItem): Promise<void> {
    const response = await refDialogues?.current?.openDialog({
      dialog: ENTRY_DIALOG.COPY,
      dialogProps: {
        entryId: entry.entryId,
        initDestination: path,
        withError: false,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.COPY, refErrorDialog),
      },
    });
    update(response, ENTRY_DIALOG.COPY, entry);
    updateEffector(response);
  }

  async function deleteEntry(entry: NavigationItem): Promise<void> {
    const response = await refDialogues?.current?.openDialog({
      dialog: ENTRY_DIALOG.DELETE,
      dialogProps: {
        entry,
        withError: false,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.DELETE, refErrorDialog),
      },
    });
    update(response, ENTRY_DIALOG.DELETE, entry);
    updateEffector(response);
  }

  async function createDashboard(this: any): Promise<void> {
    const response = await refDialogues?.current?.openDialog({
      dialog: ENTRY_DIALOG.CREATE_DASHBOARD,
      dialogProps: {
        path: path,
        withError: false,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.CREATE_DASHBOARD, refErrorDialog),
      },
    });
    if (DL.IS_INTERNAL && response.status === 'success') {
      window.location.assign(`${sdk.config.endpoints.dash}/${response.data.entryId}`);
    }
    update(response, ENTRY_DIALOG.CREATE_DASHBOARD);
    updateEffector(response);
  }

  async function accessEntry(entry: NavigationItem): Promise<void> {
    await refDialogues?.current?.openDialog({
      dialog: ENTRY_DIALOG.ACCESS,
      dialogProps: {
        entry,
      },
    });
  }

  async function onCreateMenuClick(type: CreateMenuActionType): Promise<void> {
    Utils.emitBodyClick();
    switch (type) {
      case 'folder': {
        createFolder();
        return;
      }
      case 'dashboard': {
        createDashboard();
        return;
      }
      case 'connection': {
        const currentPath = path ? `?currentPath=${encodeURIComponent(path)}` : '';
        window.location.assign(`${sdk.config.endpoints.connections}/new${currentPath}`);
        break;
      }
      case 'dataset': {
        const currentPath = path ? `?currentPath=${encodeURIComponent(path)}` : '';
        window.location.assign(`${sdk.config.endpoints.dataset}/new${currentPath}`);
        break;
      }
      case 'widget': {
        const queryPath = path ? `/?currentPath=${encodeURIComponent(path)}` : '';
        window.location.assign(`${sdk.config.endpoints.wizard}${queryPath}`);
        break;
      }
      // TODO: возможно, что не нужно в новой реализации, вернуться, когда будет рефакторинг модалок
      // case 'script':
      // case 'legacyWizard': {
      //   // eslint-disable-next-line react/prop-types
      //   if (props.onActionCreate) {
      //     defaulActionCreate(type);
      //   } else {
      //     // TODO: возможно стоит оторвать часть с new в enpoints.editor после того как он выйдет в prod
      //     const place = props.root ? `&place=${encodeURIComponent(props.root)}` : '';
      //     const currentPath = path ? `&currentPath=${encodeURIComponent(path)}` : '';
      //     const url =
      //       type === 'script'
      //         ? sdk.config.endpoints.editor
      //         : sdk.config.endpoints.legacyWizard + place + currentPath;
      //     window.location.assign(url);
      //   }
      //   break;
      // }
      default:
        return;
    }
  }

  return (
    <>
      <NavigationEntries
        showHidden
        onContextMenuClick={onContextMenuClick}
        isModalView={isModalView}
        onCreateMenuClick={onCreateMenuClick}
        onRetry={updateData}
      />
      <EntryDialogues ref={refDialogues} sdk={sdk} />
      <ErrorDialog ref={refErrorDialog} />
    </>
  );
}
