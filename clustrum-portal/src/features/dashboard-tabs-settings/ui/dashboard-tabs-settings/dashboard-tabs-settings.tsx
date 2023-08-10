import React, { ReactElement, useState } from 'react';
// TODO: будет удалено в задаче 713075
// eslint-disable-next-line
// @ts-ignore
import block from 'bem-cn-lite';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  // eslint-disable-next-line
  // @ts-ignore
  getCurrentPageTabs,
  // eslint-disable-next-line
  // @ts-ignore
  isDialogVisible,
} from '../../../../store/selectors/dash';
import { closeDialog, setTabs } from '../../../../store/actions/dash';
import { DialogType } from '@clustrum-lib/shared/types';
import { DndContainer } from '@clustrum-lib/shared/ui/drag-n-drop';
import { DndItemProps } from '@clustrum-lib/shared/ui/drag-n-drop/types';
import { EditableTabItem } from '../editable-tab-item';
import {
  DashboardTabsSettingsActions,
  DashboardTabsSettingsProps,
  DashboardTabsSettingsState,
  Tab,
} from '../../types';

const b = block('dialog-tabs');

const getTempId = (): string => {
  return `tab${Math.floor(Math.random() * 10 ** 10)}`;
};

function DashboardTabsSettings(props: DashboardTabsSettingsProps): ReactElement {
  const { tabs, visible, setTabs, closeDialog } = props;

  const [updatedTabs, setUpdatedTabs] = useState<Tab[]>(tabs);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);

  const handleUpdate = (id: string, params: Record<string, unknown>): void => {
    setUpdatedTabs(prevTabs =>
      prevTabs.map(tab => (tab.id === id ? { ...tab, ...params } : tab)),
    );
    setEditingTabId(null);
  };

  const handleRemove = (id: string): void => {
    const tabIndex = updatedTabs.findIndex(tab => id && tab.id === id);

    setUpdatedTabs(prevTabs => {
      const newTabs = [...prevTabs];
      newTabs.splice(tabIndex, 1);
      return newTabs;
    });
  };

  const handleSave = (): void => {
    setTabs(updatedTabs);
    closeDialog();
  };

  const handleCreateNewTab = (): void => {
    const newTab: Tab = {
      id: getTempId(),
      isNotSaved: true,
      title: `Вкладка ${updatedTabs.length + 1}`,
      items: [],
      layout: [],
      ignores: [],
      aliases: {},
      filtersLayout: [],
    };
    setUpdatedTabs(prevTabs => [...prevTabs, newTab]);
  };

  const renderTabItem = ({ itemData }: DndItemProps<Tab>): ReactElement => (
    <EditableTabItem
      id={itemData.id}
      title={itemData.title}
      isEditing={itemData.id === editingTabId}
      isDeletable={updatedTabs.length > 1}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
      setEditingTabId={setEditingTabId}
    />
  );

  return (
    updatedTabs && (
      <Modal
        centered
        cancelText="Отменить"
        okText="Сохранить"
        title="Вкладки"
        open={visible}
        keyboard={false}
        width={450}
        onCancel={closeDialog}
        onOk={handleSave}
      >
        <DndContainer
          highlightDropPlace
          isNeedRemove
          isNeedSwap
          id="tabs-settings"
          items={updatedTabs}
          itemSize={{ height: 40, margin: 4 }}
          wrapTo={renderTabItem}
          onUpdate={setUpdatedTabs}
        />
        <div className={b('row', { add: true })} onClick={handleCreateNewTab}>
          <PlusOutlined className={b('icon')} />
          Добавить
        </div>
      </Modal>
    )
  );
}

const mapStateToProps = (state: unknown): DashboardTabsSettingsState => ({
  tabs: getCurrentPageTabs(state),
  visible: isDialogVisible(state, DialogType.Tabs),
});

const mapDispatchToProps: DashboardTabsSettingsActions = {
  closeDialog,
  setTabs,
};

export const DashboardTabsSettingsComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardTabsSettings);
