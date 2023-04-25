import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { connect } from 'react-redux';
import { Tooltip } from 'lego-on-react';
import { ActionPanel, EntryDialogues, i18n } from '@kamatech-data-ui/clustrum';

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
import { canEdit, getCurrentPageTabs, getStyle, isDraft, isEditMode, getCurrentTab } from '../../store/selectors/dash';
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
import { Button } from 'antd';
import { ClearOutlined, EditOutlined, FilterOutlined, SettingOutlined } from '@ant-design/icons';

const b = block('dash-header');

class Header extends React.PureComponent {
  static propTypes = {
    entry: PropTypes.object,
    dash: PropTypes.object,
    isEditMode: PropTypes.bool.isRequired,
    isDraft: PropTypes.bool.isRequired,
    canEdit: PropTypes.bool,
    style: PropTypes.string,
    setMode: PropTypes.func.isRequired,
    cancelEditMode: PropTypes.func.isRequired,
    saveDash: PropTypes.func.isRequired,
    openDialog: PropTypes.func.isRequired,
    resetAllFilters: PropTypes.func.isRequired,
    openExpandedFilter: PropTypes.func.isRequired,
    exportStatusReset: PropTypes.func.isRequired,
  };

  static contextType = SignalContext;

  toaster = new Toaster();

  state = {
    progress: false,
    error: false,
    showRightsDialog: false,
  };

  addRef = React.createRef();
  saveRef = React.createRef();

  componentDidUpdate(prevProps) {
    if (this.props.dash === prevProps.dash) {
      return;
    }

    switch (this.props.dash.exportStatus) {
      case ExportStatusEnum.PENDING: {
        this.toaster.createToast({
          title: i18n('dash.export', 'start_export'),
          name: 'DASHBOARD',
          type: NOTIFY_TYPES.INFO,
          allowAutoHiding: true,
        });
        break;
      }
      case ExportStatusEnum.SUCCESS: {
        this.toaster.createToast({
          title: i18n('dash.export', 'end_export'),
          name: 'DASHBOARD',
          type: NOTIFY_TYPES.SUCCESS,
          allowAutoHiding: true,
        });
        this.props.exportStatusReset();
        break;
      }
      case ExportStatusEnum.ERROR: {
        this.toaster.createToast({
          title: i18n('dash.export', 'export_error'),
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
      // legohack: закрываем открытый dropdown, т.к. иначе он открыт до момента клика снаружи
      this.addRef.current._onOutsideClick();
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

    return [
      <Button
        cls={b('action-right', { 'button-settings': true })}
        onClick={() => this.props.openDialog(DIALOG_TYPE.SETTINGS)}
        key="button-settings"
        icon={<SettingOutlined />}
      />,
      <WidgetVisibilityDropdown
        key="widget-visibility"
        items={items}
        layout={jointLayout}
        toggleWidgetVisibility={this.toggleWidgetVisibility}
      />,
      <Button
        cls={b('action-right', { 'expand-filter-panel': true })}
        title={i18n('dash.header.view', 'button_expanded_filter_panel')}
        onClick={this.props.openExpandedFilter}
        key="button-expanded-filter-panel"
        icon={<FilterOutlined />}
      />,

      // Проблемы с отображением dropdown ant-design падает вся страница
      // <Dropdown
      //   key="add"
      //   theme="flat"
      //   view="default"
      //   tone="default"
      //   size="n"
      //   cls={b('action-right')}
      //   ref={this.addRef}
      //   switcher={
      //     <Button>
      //       {i18n('dash.header.view', 'button_add')}
      //     </Button>
      //   }
      //   popup={
      //     <Popup hiding autoclosable onOutsideClick={() => {}}>
      //       <Menu theme="normal" tone="default" view="default" size="n" type="navigation">
      //         <Menu.Item onClick={this.openDialog(DIALOG_TYPE.WIDGET)}>
      //           {i18n('dash.header.view', 'value_widget')}
      //         </Menu.Item>
      //         <Menu.Item onClick={this.openDialog(DIALOG_TYPE.CONTROL)}>
      //           {i18n('dash.header.view', 'value_control')}
      //         </Menu.Item>
      //         <Menu.Item onClick={this.openDialog(DIALOG_TYPE.TEXT)}>
      //           {i18n('dash.header.view', 'value_text')}
      //         </Menu.Item>
      //         <Menu.Item onClick={this.openDialog(DIALOG_TYPE.TITLE)}>
      //           {i18n('dash.header.view', 'value_title')}
      //         </Menu.Item>
      //       </Menu>
      //     </Popup>
      //   }
      // />,
      <Button key="cancel" onClick={this.props.cancelEditMode}>
        {i18n('dash.header.view', 'button_cancel')}
      </Button>,
      <Button
        key="save"
        disabled={!this.props.isDraft}
        cls={b('action-right', { save: true })}
        onClick={this.onSave}
        ref={this.saveRef}
      >
        {i18n('dash.header.view', 'button_save')}
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
        {i18n('dash.header.view', 'toast_error')}
      </Tooltip>,
    ];
  }

  renderViewItems() {
    const { entry, tab, canEdit, openExpandedFilter, setMode } = this.props;

    if (canEdit) {
      return [
        this.#hasVisibleExpandedFilters() ? (
          <Button
            cls={b('action-right', { 'expand-filter-panel': true })}
            title={i18n('dash.header.view', 'button_expanded_filter_panel')}
            onClick={openExpandedFilter}
            key="button-expanded-filter-panel"
          ></Button>
        ) : null,
        <Button
          cls={b('action-right', { 'clear-filters': true })}
          title={i18n('dash.header.view', 'button_clear_filters')}
          onClick={() => this.onClearFilters()}
          key="button-clear-filters"
          icon={<ClearOutlined />}
        >
          Сбросить все фильтры
        </Button>,

        // Такая проблема с отображением dropdown ant-design
        // <Dropdown
        //   key="export"
        //   theme="flat"
        //   size="n"
        //   cls={b('action-right', { 'export-pdf': true })}
        //   switcher={
        //     <Button
        //       cls={b('action-right', { 'export-pdf': true })}
        //       action={this.isExportInProgress()}
        //     ></Button>
        //   }
        //   popup={
        //     <Popup hiding autoclosable onOutsideClick={() => {}}>
        //       <Menu theme="normal" type="navigation" cls={b('export-menu')}>
        //         <Menu.Item onClick={() => this.#exportClickHandler(ExportFormat.PDF)}>PDF</Menu.Item>
        //         <Menu.Item onClick={() => this.#exportClickHandler(ExportFormat.XLSX)}>XLSX</Menu.Item>
        //         <Menu.Item onClick={() => this.#exportClickHandler(ExportFormat.XLS)}>XLS</Menu.Item>
        //         <Menu.Item onClick={() => this.#exportClickHandler(ExportFormat.CSV)}>CSV</Menu.Item>
        //       </Menu>
        //     </Popup>
        //   }
        // />,

        <>
          {!window.DL.hideEdit && (
            <Button
              title={i18n('dash.header.view', 'button_edit')}
              onClick={() => setMode(MODE.EDIT)}
              key="button-edit"
              icon={<EditOutlined />}
            >
              {i18n('dash.header.view', 'button_edit')}
            </Button>
          )}
        </>,
      ];
    }

    const DialogUnlock = EntryDialogues.dialogs.unlock;

    return [
      <Button onClick={() => this.setState({ showRightsDialog: true })} key="button-edit" icon={<EditOutlined />}>
        {i18n('dash.header.view', 'button_request-rights')}
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
    return this.props.dash.exportStatus && this.props.dash.exportStatus === ExportStatusEnum.PENDING;
  }

  render() {
    return (
      <>
        <BrowserPrint />
        {this.props.style && <style>{this.props.style}</style>}
        {!window.DL.hideSubHeader && this.props.entry && (
          <ActionPanel
            sdk={SDK}
            entryId={this.props.entry.entryId}
            rightItems={this.props.isEditMode ? this.renderEditItems() : this.renderViewItems()}
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
  style: getStyle(state),
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
