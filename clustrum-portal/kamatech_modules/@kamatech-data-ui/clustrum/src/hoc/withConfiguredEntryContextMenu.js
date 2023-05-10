import React from 'react';
import ReactCopyToClipboard from 'react-copy-to-clipboard';
import navigateHelper from '../libs/navigateHelper';

import iconRename from '@kamatech-data-ui/common/src/assets/icons/rename-file.svg';
import iconMove from '@kamatech-data-ui/common/src/assets/icons/move-file.svg';
import iconDelete from '@kamatech-data-ui/common/src/assets/icons/delete-file.svg';
import iconCopy from '@kamatech-data-ui/common/src/assets/icons/copy-file.svg';
import iconCopyLink from '@kamatech-data-ui/common/src/assets/icons/link.svg';
import iconAccessGroup from 'icons/access-group.svg';

export const ENTRY_CONTEXT_MENU_ACTION = {
  RENAME: 'rename',
  DESCRIBE: 'describe',
  DELETE: 'delete',
  MOVE: 'move',
  COPY: 'copy',
  ACCESS: 'access',
  COPY_LINK: 'copy_link',
};

const LIMITED_CONTEXT_MENU = [
  ENTRY_CONTEXT_MENU_ACTION.COPY,
  ENTRY_CONTEXT_MENU_ACTION.ACCESS,
  ENTRY_CONTEXT_MENU_ACTION.COPY_LINK,
];

export const getEntryContextMenuItems = ({ entry = {} } = {}) => {
  const TEXT = {
    RENAME: 'Переименовать',
    DESCRIBE: 'Описание',
    DELETE: 'Удалить',
    MOVE: 'Переместить',
    COPY: 'Копировать',
    ACCESS: 'Права доступа',
    COPY_LINK: 'Копировать идентификатор',
  };

  const entryContextMenuItems = [
    {
      icon: iconRename,
      text: TEXT.RENAME,
      action: ENTRY_CONTEXT_MENU_ACTION.RENAME,
    },
    {
      icon: iconRename,
      text: TEXT.DESCRIBE,
      action: ENTRY_CONTEXT_MENU_ACTION.DESCRIBE,
    },
    {
      icon: iconDelete,
      text: TEXT.DELETE,
      action: ENTRY_CONTEXT_MENU_ACTION.DELETE,
    },
    {
      icon: iconMove,
      text: TEXT.MOVE,
      action: ENTRY_CONTEXT_MENU_ACTION.MOVE,
    },
    {
      icon: iconCopy,
      text: TEXT.COPY,
      action: ENTRY_CONTEXT_MENU_ACTION.COPY,
    },
    {
      icon: iconCopyLink,
      text: TEXT.COPY_LINK,
      action: ENTRY_CONTEXT_MENU_ACTION.COPY_LINK,
      wrapper: ({ entry, children }) => {
        // eslint-disable-line react/display-name, react/prop-types
        return <ReactCopyToClipboard text={entry.entryId}>{children}</ReactCopyToClipboard>;
      },
    },
  ];

  if (entry.permissions) {
    return entry.permissions.admin
      ? entryContextMenuItems
      : entryContextMenuItems.filter(({ action }) => LIMITED_CONTEXT_MENU.includes(action));
  }

  return entryContextMenuItems;
};

export const withConfiguredEntryContextMenu = (Component, itemsPropName = 'items') =>
  function WithConfiguredEntryContextMenu(props) {
    const resultProps = {
      ...props,
      [itemsPropName]: getEntryContextMenuItems({
        entry: props.entry, // eslint-disable-line react/prop-types
      }),
    };
    return <Component {...resultProps} />;
  };
