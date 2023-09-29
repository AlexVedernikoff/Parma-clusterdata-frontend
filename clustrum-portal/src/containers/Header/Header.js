import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { connect } from 'react-redux';
import { Tooltip } from 'lego-on-react';
import { ActionPanel, EntryDialogues } from '@kamatech-data-ui/clustrum';

import {
  cancelEditMode,
  openDialog,
  resetAllFilters,
  save as saveDash,
  setMode,
  openExpandedFilter,
  toggleWidgetVisibility,
  exportStatusReset,
} from '../../store/actions/dash';
import {
  canEdit,
  getCurrentPageTabs,
  isDraft,
  isEditMode,
  getCurrentTab,
} from '../../store/selectors/dash';
import { DIALOG_TYPE, MODE } from '../../modules/constants/constants';
import { SDK } from '../../modules/sdk';
import { SIGNAL } from '@kamatech-data-ui/types/signal-types';
import { SignalContext } from '@kamatech-data-ui/context/signal-context';
import WidgetVisibilityDropdown from '../../components/WidgetVisibilityDropdown/WidgetVisibilityDropdown';
import { LAYOUT_ID } from '../../constants/constants';
import { getLayoutId } from '../../utils/helpers';
import BrowserPrint from '../BrowserPrint/BrowserPrint';
import { exportDashboard } from './model/exportDashboard';
import { Toaster } from '../../../kamatech_modules/@kamatech-data-ui/common/src';
import { NOTIFY_TYPES } from '../../../kamatech_modules/@kamatech-data-ui/clustrum/src/constants/common';
import { ExportStatusEnum } from '../../../kamatech_modules/kamatech-ui/enums/export-status.enum';
import { Button, Dropdown, Space, Popover } from 'antd';
import {
  ClearOutlined,
  DownloadOutlined,
  DownOutlined,
  EditOutlined,
  FilterOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { ExportFormat } from '../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/export/ExportFormat';
import { $appSettingsStore } from '@shared/app-settings';
import { DialogType } from '@clustrum-lib/shared/types';

const b = block('dash-header');

class Header extends React.PureComponent {
  static propTypes = {
    entry: PropTypes.object,
    dash: PropTypes.object,
    isEditMode: PropTypes.bool.isRequired,
    isDraft: PropTypes.bool.isRequired,
    canEdit: PropTypes.bool,
    setMode: PropTypes.func.isRequired,
    cancelEditMode: PropTypes.func.isRequired,
    saveDash: PropTypes.func.isRequired,
    openDialog: PropTypes.func.isRequired,
    resetAllFilters: PropTypes.func.isRequired,
    openExpandedFilter: PropTypes.func.isRequired,
    exportStatusReset: PropTypes.func.isRequired,
    hasRightSideContent: PropTypes.bool,
  };

  static contextType = SignalContext;

  toaster = new Toaster();

  state = {
    progress: false,
    error: false,
    showRightsDialog: false,
  };

  saveRef = React.createRef();

  componentDidUpdate(prevProps) {
    if (this.props.dash === prevProps.dash) {
      return;
    }

    switch (this.props.dash.exportStatus) {
      case ExportStatusEnum.PENDING: {
        this.toaster.createToast({
          title: 'Экспорт выполняется, ожидайте загрузку файла',
          name: 'DASHBOARD',
          type: NOTIFY_TYPES.INFO,
          allowAutoHiding: true,
        });
        break;
      }
      case ExportStatusEnum.SUCCESS: {
        this.toaster.createToast({
          title: 'Экспорт выполнен',
          name: 'DASHBOARD',
          type: NOTIFY_TYPES.SUCCESS,
          allowAutoHiding: true,
        });
        this.props.exportStatusReset();
        break;
      }
      case ExportStatusEnum.ERROR: {
        this.toaster.createToast({
          title: 'Ошибка выполнения экспорта',
          name: 'DASHBOARD',
          type: NOTIFY_TYPES.ERROR,
          allowAutoHiding: true,
        });
        this.props.exportStatusReset();
        break;
      }
    }
  }

  #exportClickHandler = format => {
    const { entry, tab } = this.props;

    document.querySelector('body').click();

    exportDashboard(entry, tab, format);
  };

  #hasVisibleExpandedFilters = () => {
    const { tab } = this.props;

    return tab?.filtersLayout.filter(filter => !filter.isHidden).length > 0;
  };

  onSave = async () => {
    try {
      this.setState({ progress: true });
      await this.props.saveDash();
    } catch (error) {
      this.setState({ error: true });
    }
    this.setState({ progress: false });
  };

  onClearFilters() {
    /**
     * todo в идеале хорошо бы отказаться от шины событий - просто диспатчить экшн
     * сделано потому что компоненты-виджеты не хранят свое состояние в редакс
     */
    this.context.emit(SIGNAL.RESET_FILTERS);
    this.props.resetAllFilters();
  }

  openDialog(dialogType) {
    return () => {
      this.props.openDialog(dialogType);
    };
  }

  toggleWidgetVisibility = itemId => {
    const layoutId = getLayoutId(itemId, this.props.tab);
    this.props.toggleWidgetVisibility(itemId, layoutId);
  };

  getJointLayout() {
    const layoutIds = Object.values(LAYOUT_ID);

    return layoutIds.reduce((acc, id) => {
      return [...acc, ...this.props.tab[id]];
    }, []);
  }

  renderEditItems() {
    const { items } = this.props.tab;

    const jointLayout = this.getJointLayout();

    const addItems = [
      {
        label: (
          <a onClick={this.openDialog(DIALOG_TYPE.WIDGET)}>
            Элемент аналитической панели
          </a>
        ),
        key: '1',
      },
      {
        label: <a onClick={this.openDialog(DIALOG_TYPE.CONTROL)}>Фильтр</a>,
        key: '2',
      },
      {
        label: <a onClick={this.openDialog(DIALOG_TYPE.TITLE)}>Заголовок</a>,
        key: '3',
      },
    ];

    return [
      <Button
        title="Настройки аналитической панели"
        onClick={() => this.props.openDialog(DialogType.DashboardSettings)}
        key="button-settings"
        icon={<SettingOutlined />}
      />,
      <WidgetVisibilityDropdown
        key="widget-visibility"
        items={items}
        layout={jointLayout}
        toggleWidgetVisibility={this.toggleWidgetVisibility}
        hint={'Скрытие элементов аналитической панели'}
      />,
      <Button
        title="Открыть панель расширенных фильтров"
        onClick={this.props.openExpandedFilter}
        key="button-expanded-filter-panel"
        icon={<FilterOutlined />}
      />,

      <Dropdown menu={{ items: addItems }} trigger={['click']}>
        <Button>
          <Space>
            Добавить
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>,
      <Button key="cancel" onClick={this.props.cancelEditMode}>
        Отменить
      </Button>,
      <Button
        type="primary"
        key="save"
        disabled={!this.props.isDraft}
        onClick={this.onSave}
        ref={this.saveRef}
      >
        Сохранить
      </Button>,
      <Tooltip
        key="tooltip"
        theme="error"
        view="classic"
        tone="default"
        size="n"
        autoclosable
        visible={this.state.error}
        anchor={this.saveRef.current}
        onOutsideClick={() => this.setState({ error: false })}
        to="bottom-right"
      >
        Произошла ошибка
      </Tooltip>,
    ];
  }

  renderViewItems() {
    const {
      entry,
      canEdit,
      openExpandedFilter,
      setMode,
      hasRightSideContent = true,
      dash,
    } = this.props;

    if (!hasRightSideContent) {
      return [];
    }

    const selectedTab = entry?.data?.pages?.[0]?.tabs?.find(
      tab => tab.id === dash?.tabId,
    );

    const { hasExportTemplateXlsx, hasExportTemplateDocx } = selectedTab ?? {};

    const exportItems = [
      {
        label: <a onClick={() => this.#exportClickHandler(ExportFormat.PDF)}>PDF</a>,
        key: '1',
      },
      {
        label: <a onClick={() => this.#exportClickHandler(ExportFormat.XLSX)}>XLSX</a>,
        key: '2',
      },
      {
        label: <a onClick={() => this.#exportClickHandler(ExportFormat.XLS)}>XLS</a>,
        key: '3',
      },
      {
        label: <a onClick={() => this.#exportClickHandler(ExportFormat.CSV)}>CSV</a>,
        key: '4',
      },
      hasExportTemplateXlsx && {
        label: (
          <a onClick={() => this.#exportClickHandler(ExportFormat.XLSX_FROM_TEMPLATE)}>
            XLSX (из шаблона)
          </a>
        ),
        key: '5',
      },
      hasExportTemplateDocx && {
        label: (
          <a onClick={() => this.#exportClickHandler(ExportFormat.DOCX_FROM_TEMPLATE)}>
            DOCX (из шаблона)
          </a>
        ),
        key: '6',
      },
    ].filter(Boolean);

    const isEditButtonVisible = !$appSettingsStore.getState().hideEdit;
    const isDashExportButtonVisible = !$appSettingsStore.getState().hideDashExport;

    if (canEdit) {
      return [
        this.#hasVisibleExpandedFilters() ? (
          <Popover placement="bottom" content={<span>Расширенный фильтр</span>}>
            <Button
              onClick={openExpandedFilter}
              key="button-expanded-filter-panel"
              icon={<FilterOutlined />}
            />
          </Popover>
        ) : null,
        <Popover placement="bottom" content={<span>Сбросить фильтры</span>}>
          <Button
            onClick={() => this.onClearFilters()}
            key="button-clear-filters"
            icon={<ClearOutlined />}
          />
        </Popover>,
        <>
          {isDashExportButtonVisible && (
            <Popover placement="bottom" content={<span>Экспортировать</span>}>
              <Dropdown menu={{ items: exportItems }} trigger={['click']}>
                <Button icon={<DownloadOutlined />}></Button>
              </Dropdown>
            </Popover>
          )}
        </>,
        <>
          {isEditButtonVisible && (
            <Popover placement="bottom" content={<span>Редактировать</span>}>
              <Button
                onClick={() => setMode(MODE.EDIT)}
                key="button-edit"
                icon={<EditOutlined />}
              ></Button>
            </Popover>
          )}
        </>,
      ];
    }

    const DialogUnlock = EntryDialogues.dialogs.unlock;

    return [
      <Button
        onClick={() => this.setState({ showRightsDialog: true })}
        key="button-edit"
        icon={<EditOutlined />}
      >
        Запросить права
      </Button>,
      <DialogUnlock
        sdk={SDK}
        onClose={() => this.setState({ showRightsDialog: false })}
        visible={this.state.showRightsDialog}
        dialogProps={{ entry }}
        key="dialog-unlock"
      />,
    ];
  }

  isExportInProgress() {
    return (
      this.props.dash.exportStatus &&
      this.props.dash.exportStatus === ExportStatusEnum.PENDING
    );
  }

  render() {
    const { isEditMode } = this.props;
    const renderRightItems = isEditMode ? this.renderEditItems() : this.renderViewItems();

    return (
      <>
        <BrowserPrint />
        {!$appSettingsStore.getState().hideSubHeader && this.props.entry && (
          <ActionPanel
            sdk={SDK}
            entryId={this.props.entry.entryId}
            rightItems={renderRightItems}
            className={b('action-panel', {
              sticky: this.props.isEditMode,
              'is-edit': this.props.isEditMode,
              'is-view': !this.props.isEditMode,
            })}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  entry: state.dash.entry,
  dash: state.dash,
  tab: getCurrentTab(state),
  tabs: getCurrentPageTabs(state),
  canEdit: canEdit(state),
  isEditMode: isEditMode(state),
  isDraft: isDraft(state),
});

const mapDispatchToProps = {
  setMode,
  cancelEditMode,
  saveDash,
  openDialog,
  resetAllFilters,
  openExpandedFilter,
  toggleWidgetVisibility,
  exportStatusReset,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
