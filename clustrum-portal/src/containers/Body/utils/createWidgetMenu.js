import React from 'react';

import { Icon } from '@kamatech-data-ui/common/src';

import iconPencil from '../../../../kamatech_modules/@kamatech-data-ui/clustrum/src/icons/pencil.svg';
import iconAnotherTab from '../../../../kamatech_modules/@kamatech-data-ui/clustrum/src/icons/another-tab.svg';

import { EXPORT } from '../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/extensions/menu-items';

const NEW_TAB = {
  get title() {
    return 'Открыть в новой вкладке';
  },
  icon: <Icon data={iconAnotherTab} width="16" height="16" />,
  isVisible: () => true,
  action: ({ propsData: { id } }) =>
    window.open(window.DL.endpoints.wizard + `/preview/${id}`),
};

const createWidgetEditorOpeningItem = onOpenWidgetEditor => ({
  get title() {
    return 'Редактировать';
  },
  icon: <Icon data={iconPencil} width="16" height="16" />,
  isVisible: () => !window.DL.hideEdit,
  action: ({ propsData: { id } }) => onOpenWidgetEditor(id),
});

export default onOpenWidgetEditor => [
  EXPORT,
  // Временно скрываем кнопку "Открыть в новой вкладке"
  // NEW_TAB,
  createWidgetEditorOpeningItem(onOpenWidgetEditor),
];
