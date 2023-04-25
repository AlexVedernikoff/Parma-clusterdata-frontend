import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { connect } from 'react-redux';
import { Button, Dropdown, Icon as LegoIcon, Menu, Popup, Tooltip } from 'lego-on-react';
import { ActionPanel, EntryDialogues } from '@kamatech-data-ui/clustrum';
import { Icon } from '@kamatech-data-ui/common/src';
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
import iconPlus from '@kamatech-data-ui/clustrum/src/icons/plus.svg';
import iconCog from '@kamatech-data-ui/clustrum/src/icons/cog.svg';
import iconEraser from '@kamatech-data-ui/clustrum/src/icons/eraser.svg';
import iconExport from '@kamatech-data-ui/clustrum/src/icons/export.svg';
import iconFilter from '@kamatech-data-ui/clustrum/src/icons/filter-blue.svg';
import { SIGNAL } from '@kamatech-data-ui/types/signal-types';
import { SignalContext } from '@kamatech-data-ui/context/signal-context';
import WidgetVisibilityDropdown from '../../components/WidgetVisibilityDropdown/WidgetVisibilityDropdown';
import { ExportFormat } from '../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/export/ExportFormat';
import { LAYOUT_ID } from '../../constants/constants';
import { getLayoutId } from '../../utils/helpers';
import BrowserPrint from '../BrowserPrint/BrowserPrint';
import { exportDashboard } from './model/exportDashboard';
import { Toaster } from '../../../kamatech_modules/@kamatech-data-ui/common/src';
import { NOTIFY_TYPES } from '../../../kamatech_modules/@kamatech-data-ui/clustrum/src/constants/common';
import { ExportStatusEnum } from '../../../kamatech_modules/kamatech-ui/enums/export-status.enum';

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
        title="Открыть панель расширенных фильтров"
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
        Вкладки
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
            Добавить
            <LegoIcon size="n" glyph="carets-v" />
          </Button>
        }
        popup={
          <Popup hiding autoclosable onOutsideClick={() => {}}>
            <Menu theme="normal" tone="default" view="default" size="n" type="navigation">
              <Menu.Item onClick={this.openDialog(DIALOG_TYPE.WIDGET)}>Диаграмма</Menu.Item>
              <Menu.Item onClick={this.openDialog(DIALOG_TYPE.CONTROL)}>Фильтр</Menu.Item>
              <Menu.Item onClick={this.openDialog(DIALOG_TYPE.TEXT)}>Текст</Menu.Item>
              <Menu.Item onClick={this.openDialog(DIALOG_TYPE.TITLE)}>Заголовок</Menu.Item>
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
        Отменить
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
            title="Открыть панель расширенных фильтров"
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
          title="Сбросить фильтры"
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
              title="Редактировать"
              onClick={() => setMode(MODE.EDIT)}
              key="button-edit"
            >
              Редактировать
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
