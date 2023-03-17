import React from 'react';

import { Icon } from '@parma-data-ui/common/src';

import { i18n } from '../../../../parma_modules/@parma-data-ui/clusterdata/src/utils/i18n';
import iconPencil from '../../../../parma_modules/@parma-data-ui/clusterdata/src/icons/pencil.svg';
import iconAnotherTab from '../../../../parma_modules/@parma-data-ui/clusterdata/src/icons/another-tab.svg';

import { EXPORT } from '../../../../parma_modules/@parma-data-ui/chartkit/lib/extensions/menu-items';

const NEW_TAB = {
  get title() {
    return i18n('dash.chartkit-menu.view', 'button_new-tab');
  },
  icon: <Icon data={iconAnotherTab} width="16" height="16" />,
  isVisible: () => true,
  action: ({ propsData: { id } }) => window.open(window.DL.endpoints.wizard + `/preview/${id}`),
};

const createWidgetEditorOpeningItem = onOpenWidgetEditor => ({
  get title() {
    return i18n('dash.chartkit-menu.view', 'button_edit');
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
