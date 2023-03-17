import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { connect } from 'react-redux';
import { Button, Dropdown, Icon as LegoIcon, Menu, Popup, Tooltip } from 'lego-on-react';
import { ActionPanel, EntryDialogues, i18n } from '@parma-data-ui/clusterdata';
import { Icon } from '@parma-data-ui/common/src';
import ButtonIcon from '../../components/ButtonIcon/ButtonIcon';
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
import iconPlus from '@parma-data-ui/clusterdata/src/icons/plus.svg';
import iconCog from '@parma-data-ui/clusterdata/src/icons/cog.svg';
import iconEraser from '@parma-data-ui/clusterdata/src/icons/eraser.svg';
import iconExport from '@parma-data-ui/clusterdata/src/icons/export.svg';
import iconFilter from '@parma-data-ui/clusterdata/src/icons/filter-blue.svg';
import { SignalContext } from '@parma-data-ui/dashkit/src/context/SignalContext';
import { SIGNAL } from '@parma-data-ui/dashkit/src/constants/common';
import WidgetVisibilityDropdown from '../../components/WidgetVisibilityDropdown/WidgetVisibilityDropdown';
import { ExportFormat } from '../../../parma_modules/@parma-data-ui/chartkit/lib/modules/export/ExportFormat';
import { LAYOUT_ID } from '../../constants/constants';
import { getLayoutId } from '../../utils/helpers';
import BrowserPrint from '../BrowserPrint/BrowserPrint';
import { exportDashboard } from './model/exportDashboard';
import { Toaster } from '../../../parma_modules/@parma-data-ui/common/src';
import { NOTIFY_TYPES } from '../../../parma_modules/@parma-data-ui/clusterdata/src/constants/common';
import { ExportStatusEnum } from '../../../parma_modules/parma-ui/enums/export-status.enum';

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
        theme="flat"
        view="default"
        tone="default"
        size="n"
        onClick={() => this.props.openDialog(DIALOG_TYPE.SETTINGS)}
        key="button-settings"
      >
        <ButtonIcon>
          <Icon data={iconCog} width="22" height="22" />
        </ButtonIcon>
      </Button>,
      <WidgetVisibilityDropdown
        key="widget-visibility"
        items={items}
        layout={jointLayout}
        toggleWidgetVisibility={this.toggleWidgetVisibility}
      />,
      <Button
        cls={b('action-right', { 'expand-filter-panel': true })}
        theme="flat"
        view="default"
        tone="default"
        size="n"
        title={i18n('dash.header.view', 'button_expanded_filter_panel')}
        onClick={this.props.openExpandedFilter}
        key="button-expanded-filter-panel"
      >
        <ButtonIcon>
          <Icon data={iconFilter} width="22" height="22" />
        </ButtonIcon>
      </Button>,
      <Button
        key="tabs"
        theme="flat"
        view="default"
        tone="default"
        size="n"
        cls={b('action-right', { tabs: true })}
        onClick={() => this.props.openDialog(DIALOG_TYPE.TABS)}
      >
        <ButtonIcon>
          <Icon data={iconPlus} width="16" />
        </ButtonIcon>
        {i18n('dash.header.view', 'button_tabs')}
      </Button>,
      <Dropdown
        key="add"
        theme="flat"
        view="default"
        tone="default"
        size="n"
        cls={b('action-right')}
        ref={this.addRef}
        switcher={
          <Button theme="flat" view="default" tone="default" size="n">
            {i18n('dash.header.view', 'button_add')}
            <LegoIcon size="n" glyph="carets-v" />
          </Button>
        }
        popup={
          <Popup hiding autoclosable onOutsideClick={() => {}}>
            <Menu theme="normal" tone="default" view="default" size="n" type="navigation">
              <Menu.Item onClick={this.openDialog(DIALOG_TYPE.WIDGET)}>
                {i18n('dash.header.view', 'value_widget')}
              </Menu.Item>
              <Menu.Item onClick={this.openDialog(DIALOG_TYPE.CONTROL)}>
                {i18n('dash.header.view', 'value_control')}
              </Menu.Item>
              <Menu.Item onClick={this.openDialog(DIALOG_TYPE.TEXT)}>
                {i18n('dash.header.view', 'value_text')}
              </Menu.Item>
              <Menu.Item onClick={this.openDialog(DIALOG_TYPE.TITLE)}>
                {i18n('dash.header.view', 'value_title')}
              </Menu.Item>
            </Menu>
          </Popup>
        }
      />,
      <Button
        key="cancel"
        theme="normal"
        view="default"
        tone="default"
        size="n"
        cls={b('action-right', { cancel: true })}
        onClick={this.props.cancelEditMode}
      >
        {i18n('dash.header.view', 'button_cancel')}
      </Button>,
      <Button
        key="save"
        theme="action"
        view="default"
        tone="default"
        size="n"
        progress={this.state.progress}
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
            theme="flat"
            view="default"
            tone="default"
            size="n"
            title={i18n('dash.header.view', 'button_expanded_filter_panel')}
            onClick={openExpandedFilter}
            key="button-expanded-filter-panel"
          >
            <ButtonIcon>
              <Icon data={iconFilter} width="22" height="22" />
            </ButtonIcon>
          </Button>
        ) : null,
        <Button
          cls={b('action-right', { 'clear-filters': true })}
          theme="flat"
          view="default"
          tone="default"
          size="n"
          title={i18n('dash.header.view', 'button_clear_filters')}
          onClick={() => this.onClearFilters()}
          key="button-clear-filters"
        >
          <ButtonIcon>
            <Icon data={iconEraser} width="22" height="22" />
          </ButtonIcon>
        </Button>,

        <Dropdown
          key="export"
          theme="flat"
          size="n"
          cls={b('action-right', { 'export-pdf': true })}
          switcher={
            <Button
              cls={b('action-right', { 'export-pdf': true })}
              progress={this.isExportInProgress()}
              action={this.isExportInProgress()}
              theme="flat"
              view="default"
              tone="default"
              size="n"
            >
              <ButtonIcon>
                <Icon data={iconExport} width="22" height="22" />
              </ButtonIcon>
            </Button>
          }
          popup={
            <Popup hiding autoclosable onOutsideClick={() => {}}>
              <Menu theme="normal" type="navigation" cls={b('export-menu')}>
                <Menu.Item onClick={() => this.#exportClickHandler(ExportFormat.PDF)}>PDF</Menu.Item>
                <Menu.Item onClick={() => this.#exportClickHandler(ExportFormat.XLSX)}>XLSX</Menu.Item>
                <Menu.Item onClick={() => this.#exportClickHandler(ExportFormat.XLS)}>XLS</Menu.Item>
                <Menu.Item onClick={() => this.#exportClickHandler(ExportFormat.CSV)}>CSV</Menu.Item>
              </Menu>
            </Popup>
          }
        />,

        <>
          {!window.DL.hideEdit && (
            <Button
              cls={b('action-right', { edit: true })}
              theme="flat"
              view="default"
              tone="default"
              size="n"
              title={i18n('dash.header.view', 'button_edit')}
              onClick={() => setMode(MODE.EDIT)}
              key="button-edit"
            >
              {i18n('dash.header.view', 'button_edit')}
            </Button>
          )}
        </>,
      ];
    }

    const DialogUnlock = EntryDialogues.dialogs.unlock;

    return [
      <Button
        cls={b('action-right', { edit: true })}
        theme="flat"
        view="default"
        tone="default"
        size="n"
        onClick={() => this.setState({ showRightsDialog: true })}
        key="button-edit"
      >
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
