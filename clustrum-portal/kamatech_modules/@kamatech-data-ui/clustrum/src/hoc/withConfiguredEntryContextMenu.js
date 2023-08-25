import React from 'react';
import ReactCopyToClipboard from 'react-copy-to-clipboard';
import navigateHelper from '../libs/navigateHelper';

import iconRename from '@kamatech-data-ui/common/src/assets/icons/rename-file.svg';
import iconMove from '@kamatech-data-ui/common/src/assets/icons/move-file.svg';
import iconDelete from '@kamatech-data-ui/common/src/assets/icons/delete-file.svg';
import iconCopy from '@kamatech-data-ui/common/src/assets/icons/copy-file.svg';
import iconCopyLink from '@kamatech-data-ui/common/src/assets/icons/link.svg';
import iconAccessGroup from 'icons/access-group.svg';
import { ContextMenuActions } from '@entities/navigation-base/types/context-menu-actions';

const LIMITED_CONTEXT_MENU = [
  ContextMenuActions.copy,
  ContextMenuActions.access,
  ContextMenuActions.copyLink,
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
      action: ContextMenuActions.rename,
    },
    {
      icon: iconRename,
      text: TEXT.DESCRIBE,
      action: ContextMenuActions.describe,
    },
    {
      icon: iconDelete,
      text: TEXT.DELETE,
      action: ContextMenuActions.delete,
    },
    {
      icon: iconMove,
      text: TEXT.MOVE,
      action: ContextMenuActions.move,
    },
    {
      icon: iconCopy,
      text: TEXT.COPY,
      action: ContextMenuActions.copy,
    },
    {
      icon: iconCopyLink,
      text: TEXT.COPY_LINK,
      action: ContextMenuActions.COPY_LINK,
      wrapper: ({ entry, children }) => {
        // eslint-disable-line react/display-name, react/prop-types
        return (
          <ReactCopyToClipboard text={entry.entryId}>{children}</ReactCopyToClipboard>
        );
      },
    },
  ];

  if (entry.permissions) {
    return entry.permissions.admin
      ? entryContextMenuItems
      : entryContextMenuItems.filter(({ action }) =>
          LIMITED_CONTEXT_MENU.includes(action),
        );
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
