import React from 'react';
import ReactCopyToClipboard from 'react-copy-to-clipboard';
import navigateHelper from '../libs/navigateHelper';

import iconRename from '@kamatech-data-ui/common/src/assets/icons/rename-file.svg';
import iconMove from '@kamatech-data-ui/common/src/assets/icons/move-file.svg';
import iconDelete from '@kamatech-data-ui/common/src/assets/icons/delete-file.svg';
import iconCopy from '@kamatech-data-ui/common/src/assets/icons/copy-file.svg';
import iconCopyLink from '@kamatech-data-ui/common/src/assets/icons/link.svg';
import iconAccessGroup from 'icons/access-group.svg';
import { ContextMenuActions } from '@entities/navigation-base/types';

const LIMITED_CONTEXT_MENU = [
  ContextMenuActions.Copy,
  ContextMenuActions.Access,
  ContextMenuActions.CopyLink,
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
      action: ContextMenuActions.Rename,
    },
    {
      icon: iconRename,
      text: TEXT.DESCRIBE,
      action: ContextMenuActions.Describe,
    },
    {
      icon: iconDelete,
      text: TEXT.DELETE,
      action: ContextMenuActions.Delete,
    },
    {
      icon: iconMove,
      text: TEXT.MOVE,
      action: ContextMenuActions.Move,
    },
    {
      icon: iconCopy,
      text: TEXT.COPY,
      action: ContextMenuActions.Copy,
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
