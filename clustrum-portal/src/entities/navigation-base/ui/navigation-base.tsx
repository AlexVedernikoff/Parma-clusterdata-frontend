import React, { ReactElement, useRef } from 'react';
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
import { DL } from '../../../../kamatech_modules/@kamatech-data-ui/clustrum/src/constants/common';
import {
  ContextMenuActions,
  CreateMenuActionType,
  NavItemContextMenuClickParams,
  NavigationBase,
} from '../types';
import { NavigationEntryData } from '@clustrum-lib/shared/types';
import { $pathInFolder } from '@entities/navigation-base';
import { useCustomNotification } from '@shared/lib/hooks';
import { unsecuredCopyToClipboard } from '../lib/utils';

/**
 * TODO
 * это старый компонент, который позволяет подключить к навигации модальные окна, возможно, что он будет не нужен
 * надо смотреть на реализацию новых модальных окон
 * здесь много разных старых функций, которые обрабатывают действия с контекстным меню
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
  const [openNotification, contextHolder] = useCustomNotification();
  /**
   * обновить отображение навигации при помощи моделей из эффектора
   */
  const updateEffector = (response: { status: string }): void => {
    if (response.status === 'success') {
      updateData();
    }
  };

  const handleContextMenuClick = ({
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
        return copyEntryId(entry);
      }
      default:
        return false;
    }
  };

  // TODO: поправить функцию после редактирования модальных окон (возможно, она будет не нужна)
  function update(response: { status: string }, entryDialog: any, entry?: any): void {
    if (response.status === 'success') {
      if (onUpdate) {
        onUpdate(response);
      } else if (currentPageEntry) {
        switch (entryDialog) {
          case ENTRY_DIALOG.RENAME:
            // eslint-disable-next-line max-depth
            if (currentPageEntry.entryId === entry.entryId) {
              window.location.reload();
            }
            break;
          case ENTRY_DIALOG.MOVE:
            // eslint-disable-next-line max-depth
            if ((currentPageEntry.key || '').startsWith(entry.key)) {
              window.location.reload();
            }
            break;
          case ENTRY_DIALOG.DELETE:
            // eslint-disable-next-line max-depth
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
        path: `${$pathInFolder.getState()}${path}`,
        withError: false,
        onNotify: entryDialoguesNotify(
          ENTRY_DIALOG.CREATE_FOLDER,
          refErrorDialog,
          openNotification,
        ),
      },
    });
    update(response, ENTRY_DIALOG.CREATE_FOLDER);
    updateEffector(response);
  }

  async function renameEntry(entry: NavigationEntryData): Promise<void> {
    const response = await refDialogues?.current?.openDialog({
      dialog: ENTRY_DIALOG.RENAME,
      dialogProps: {
        entryId: entry.entryId,
        initName: entry.name,
        withError: false,
        onNotify: entryDialoguesNotify(
          ENTRY_DIALOG.RENAME,
          refErrorDialog,
          openNotification,
        ),
      },
    });
    update(response, ENTRY_DIALOG.RENAME, entry);
    updateEffector(response);
  }

  async function describeEntry(entry: NavigationEntryData): Promise<void> {
    const response = await refDialogues?.current?.openDialog({
      dialog: ENTRY_DIALOG.DESCRIBE,
      dialogProps: {
        entryId: entry.entryId,
        description: entry.description,
        withError: false,
        onNotify: entryDialoguesNotify(
          ENTRY_DIALOG.DESCRIBE,
          refErrorDialog,
          openNotification,
        ),
      },
    });
    update(response, ENTRY_DIALOG.DESCRIBE, entry);
    updateEffector(response);
  }

  async function moveEntry(entry: NavigationEntryData): Promise<void> {
    const response = await refDialogues?.current?.openDialog({
      dialog: ENTRY_DIALOG.MOVE,
      dialogProps: {
        entryId: entry.entryId,
        initDestination: path,
        inactiveEntryKey: entry.scope === 'folder' ? entry.key : undefined,
        withError: false,
        sdk,
        onNotify: entryDialoguesNotify(
          ENTRY_DIALOG.MOVE,
          refErrorDialog,
          openNotification,
        ),
      },
    });
    update(response, ENTRY_DIALOG.MOVE, entry);
    updateEffector(response);
  }

  async function copyEntry(entry: NavigationEntryData): Promise<void> {
    const response = await refDialogues?.current?.openDialog({
      dialog: ENTRY_DIALOG.COPY,
      dialogProps: {
        entryId: entry.entryId,
        initDestination: path,
        withError: false,
        onNotify: entryDialoguesNotify(
          ENTRY_DIALOG.COPY,
          refErrorDialog,
          openNotification,
        ),
      },
    });
    update(response, ENTRY_DIALOG.COPY, entry);
    updateEffector(response);
  }

  async function copyEntryId(entry: NavigationEntryData): Promise<void> {
    if (window.isSecureContext && navigator.clipboard) {
      return await navigator.clipboard.writeText(entry.entryId);
    } else {
      return unsecuredCopyToClipboard(entry.entryId);
    }
  }

  async function deleteEntry(entry: NavigationEntryData): Promise<void> {
    const response = await refDialogues?.current?.openDialog({
      dialog: ENTRY_DIALOG.DELETE,
      dialogProps: {
        entry,
        withError: false,
        onNotify: entryDialoguesNotify(
          ENTRY_DIALOG.DELETE,
          refErrorDialog,
          openNotification,
        ),
      },
    });
    update(response, ENTRY_DIALOG.DELETE, entry);
    updateEffector(response);
  }

  async function createDashboard(this: any): Promise<void> {
    const response = await refDialogues?.current?.openDialog({
      dialog: ENTRY_DIALOG.CREATE_DASHBOARD,
      dialogProps: {
        path: `${$pathInFolder.getState()}${path}`,
        withError: false,
        onNotify: entryDialoguesNotify(
          ENTRY_DIALOG.CREATE_DASHBOARD,
          refErrorDialog,
          openNotification,
        ),
      },
    });
    if (DL.IS_INTERNAL && response.status === 'success') {
      window.location.assign(`${sdk.config.endpoints.dash}/${response.data.entryId}`);
    }
    update(response, ENTRY_DIALOG.CREATE_DASHBOARD);
    updateEffector(response);
  }

  async function accessEntry(entry: NavigationEntryData): Promise<void> {
    await refDialogues?.current?.openDialog({
      dialog: ENTRY_DIALOG.ACCESS,
      dialogProps: {
        entry,
      },
    });
  }

  async function handleCreateMenuClick(type: CreateMenuActionType): Promise<void> {
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
      default:
        return;
    }
  }

  return (
    <>
      <NavigationEntries
        showHidden
        onContextMenuClick={handleContextMenuClick}
        isModalView={isModalView}
        onCreateMenuClick={handleCreateMenuClick}
        onRetry={updateData}
      />
      <EntryDialogues ref={refDialogues} sdk={sdk} />
      <ErrorDialog ref={refErrorDialog} />
      {contextHolder}
    </>
  );
}
